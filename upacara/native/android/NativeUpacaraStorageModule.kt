package com.lynx.explorer.modules

import android.content.Context
import android.content.SharedPreferences
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import com.lynx.react.bridge.Callback
import com.lynx.tasm.behavior.LynxContext

/** Penyimpanan lokal untuk progres cue dan setelan aplikasi Upacara. */
class NativeUpacaraStorageModule(context: Context) : LynxModule(context) {
    companion object {
        private const val PREF_NAME = "upacara_preferences"
    }

    private fun preferensi(): SharedPreferences {
        val context = (mContext as LynxContext).context
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    @LynxMethod
    fun setItem(key: String, value: String) {
        preferensi().edit().putString(key, value).apply()
    }

    @LynxMethod
    fun getItem(key: String, callback: Callback) {
        callback.invoke(preferensi().getString(key, null))
    }

    @LynxMethod
    fun clearStorage() {
        preferensi().edit().clear().apply()
    }
}
