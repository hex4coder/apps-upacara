package com.hex4coder.upacara

import android.app.Activity
import android.os.Bundle
import com.hex4coder.upacara.modules.NativeUpacaraAudioModule
import com.lynx.tasm.LynxView
import com.lynx.tasm.LynxViewBuilder

class MainActivity : Activity() {

    private var lynxView: LynxView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val builder = LynxViewBuilder()
        builder.setTemplateProvider(UpacaraTemplateProvider(this))
        val view = builder.build(this)
        lynxView = view
        setContentView(view)

        view.renderTemplateUrl("main.lynx.bundle", "")
    }

    override fun onDestroy() {
        // Pastikan audio tidak berlanjut dan memory LynxView dilepaskan.
        NativeUpacaraAudioModule.hentikanSemua()
        lynxView?.destroy()
        lynxView = null
        super.onDestroy()
    }
}
