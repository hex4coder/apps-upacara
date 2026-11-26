package com.hex4coder.upacara.modules

import android.content.Context
import android.media.MediaPlayer
import android.util.Log
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import com.lynx.react.bridge.Callback
import com.lynx.tasm.behavior.LynxContext

/**
 * Modul audio untuk aplikasi Upacara.
 *
 * File audio diharapkan di `app/src/main/assets/audio/<id>.mp3`,
 * mis. `audio/indonesia-raya.mp3`, `audio/mengheningkan-cipta.mp3`.
 *
 * Tidak memerlukan izin INTERNET: semua audio lokal.
 */
class NativeUpacaraAudioModule(context: Context) : LynxModule(context) {

    companion object {
        @Volatile
        private var player: MediaPlayer? = null
        private var volume: Float = 0.7f
        private var laguAktif: String = ""

        private fun lepasPlayer(mediaPlayer: MediaPlayer) {
            try {
                if (mediaPlayer.isPlaying) mediaPlayer.stop()
                mediaPlayer.reset()
                mediaPlayer.release()
            } catch (_: Exception) {
                // Abaikan pelepasan yang gagal.
            }
        }

        /** Dipanggil host saat Activity dihancurkan agar audio tidak berlanjut. */
        @JvmStatic
        fun hentikanSemua() {
            player?.let { lepasPlayer(it) }
            player = null
            laguAktif = ""
        }
    }

    private fun appContext(): Context = (mContext as LynxContext).context

    @LynxMethod
    fun play(id: String, volumePersen: Int) {
        stop()
        laguAktif = id
        volume = volumePersen.coerceIn(0, 100) / 100f

        val path = "audio/$id.mp3"
        try {
            val descriptor = appContext().assets.openFd(path)
            val mediaPlayer = MediaPlayer()
            mediaPlayer.setDataSource(
                descriptor.fileDescriptor,
                descriptor.startOffset,
                descriptor.length,
            )
            descriptor.close()
            mediaPlayer.setVolume(volume, volume)
            mediaPlayer.isLooping = false
            mediaPlayer.prepare()
            mediaPlayer.start()
            player = mediaPlayer
        } catch (error: Exception) {
            Log.w("UpacaraAudio", "Audio tidak ditemukan: $path", error)
        }
    }

    @LynxMethod
    fun pause() {
        player?.takeIf { it.isPlaying }?.pause()
    }

    @LynxMethod
    fun resume() {
        player?.takeIf { !it.isPlaying }?.start()
    }

    @LynxMethod
    fun stop() {
        player?.let { lepasPlayer(it) }
        player = null
    }

    @LynxMethod
    fun setVolume(volumePersen: Int) {
        volume = volumePersen.coerceIn(0, 100) / 100f
        player?.setVolume(volume, volume)
    }

    @LynxMethod
    fun fade(durationMs: Int, direction: String) {
        val mediaPlayer = player ?: return
        val durasi = durationMs.coerceAtLeast(1)
        val nilaiAwal = if (direction == "out") volume else 0f
        val nilaiAkhir = if (direction == "out") 0f else volume
        val langkah = 20
        val jeda = (durasi.toFloat() / langkah).toLong().coerceAtLeast(1L)

        Thread {
            for (i in 0 until langkah) {
                if (player != mediaPlayer) return@Thread
                val nilai = nilaiAwal + (nilaiAkhir - nilaiAwal) * (i.toFloat() / langkah)
                mediaPlayer.setVolume(nilai, nilai)
                try {
                    Thread.sleep(jeda)
                } catch (_: InterruptedException) {
                    return@Thread
                }
            }
            if (player == mediaPlayer) {
                mediaPlayer.setVolume(nilaiAkhir, nilaiAkhir)
            }
        }.start()
    }

    @LynxMethod
    fun getCurrentPosition(callback: Callback) {
        callback.invoke(player?.currentPosition?.toDouble() ?: 0.0)
    }

    fun laguSaatIni(): String = laguAktif
}
