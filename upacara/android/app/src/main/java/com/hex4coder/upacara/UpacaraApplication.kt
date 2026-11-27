package com.hex4coder.upacara

import android.app.Application
import com.hex4coder.upacara.modules.NativeUpacaraAudioModule
import com.hex4coder.upacara.modules.NativeUpacaraStorageModule
import com.lynx.service.log.LynxLogService
import com.lynx.tasm.LynxEnv
import com.lynx.tasm.service.LynxServiceCenter

/** Inisialisasi global Lynx sebelum LynxView mana pun dibuat. */
class UpacaraApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        LynxServiceCenter.inst().registerService(LynxLogService)
        LynxEnv.inst().init(this, null, null, null)

        // Nama harus identik dengan deklarasi di src/typing.d.ts.
        LynxEnv.inst().registerModule(
            "NativeUpacaraAudioModule",
            NativeUpacaraAudioModule::class.java,
        )
        LynxEnv.inst().registerModule(
            "NativeUpacaraStorageModule",
            NativeUpacaraStorageModule::class.java,
        )
    }
}
