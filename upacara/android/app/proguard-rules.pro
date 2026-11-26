# Aturan R8 untuk Lynx Engine dan native module Upacara.
# LYNX START
-dontwarn android.support.annotation.Keep
-keep @android.support.annotation.Keep class **
-keep @android.support.annotation.Keep class ** {
    @android.support.annotation.Keep <fields>;
    @android.support.annotation.Keep <methods>;
}
-dontwarn androidx.annotation.Keep
-keep @androidx.annotation.Keep class **
-keep @androidx.annotation.Keep class ** {
    @androidx.annotation.Keep <fields>;
    @androidx.annotation.Keep <methods>;
}
-keepclasseswithmembers,includedescriptorclasses class * {
    native <methods>;
}
-keepclasseswithmembers class * {
    @com.lynx.tasm.base.CalledByNative <methods>;
}
-keepclasseswithmembers class * {
    @com.lynx.jsbridge.LynxMethod <methods>;
}
-keepclassmembers class * {
    @com.lynx.tasm.behavior.LynxProp <methods>;
    @com.lynx.tasm.behavior.LynxPropGroup <methods>;
    @com.lynx.tasm.behavior.LynxUIMethod <methods>;
}
-keepclassmembers class com.lynx.tasm.behavior.ui.UIGroup {
    public boolean needCustomLayout();
}
-keepclassmembers class com.lynx.tasm.LynxTemplateRender {
    private com.lynx.tasm.core.resource.LynxResourceLoader mLoader;
    private com.lynx.tasm.core.resource.LynxResourceLoader mResourceLoader;
}
-keep class com.lynx.tasm.behavior.ui.LynxBaseUI
-keep class com.lynx.tasm.behavior.shadow.ShadowNode
-keep class com.lynx.jsbridge.LynxModule { *; }
-keep class * extends com.lynx.tasm.behavior.ui.LynxBaseUI
-keep class * extends com.lynx.tasm.behavior.shadow.ShadowNode
-keep class * extends com.lynx.jsbridge.LynxModule { *; }
-keep class * extends com.lynx.jsbridge.LynxContextModule
# LYNX END

# Modul Upacara dipanggil dari JS lewat refleksi Lynx.
-keep class com.hex4coder.upacara.modules.** { *; }
