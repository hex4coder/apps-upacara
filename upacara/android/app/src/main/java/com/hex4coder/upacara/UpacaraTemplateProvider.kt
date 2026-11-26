package com.hex4coder.upacara

import android.content.Context
import com.lynx.tasm.provider.AbsTemplateProvider
import java.io.ByteArrayOutputStream
import java.io.IOException

/** Memuat main.lynx.bundle dari assets. Tidak ada jaringan. */
class UpacaraTemplateProvider(context: Context) : AbsTemplateProvider() {

    private val appContext: Context = context.applicationContext

    override fun loadTemplate(uri: String, callback: Callback) {
        Thread {
            try {
                appContext.assets.open(uri).use { input ->
                    ByteArrayOutputStream().use { out ->
                        val buffer = ByteArray(1024)
                        var length: Int
                        while (input.read(buffer).also { length = it } != -1) {
                            out.write(buffer, 0, length)
                        }
                        callback.onSuccess(out.toByteArray())
                    }
                }
            } catch (error: IOException) {
                callback.onFailed(error.message)
            }
        }.start()
    }
}
