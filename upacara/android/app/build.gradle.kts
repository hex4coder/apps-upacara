plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.hex4coder.upacara"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.hex4coder.upacara"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }

    sourceSets {
        getByName("main") {
            // Sumber kanonik modul native ada satu folder di atas project host.
            // Kotlin boleh berada di java source set (dokumentasi Android).
            java.srcDir("../../native/android")
        }
    }
}

dependencies {
    // Versi engine harus lebih baru atau sama dengan targetSdkVersion bundle (3.2).
    implementation("org.lynxsdk.lynx:lynx:4.2.0")
    implementation("org.lynxsdk.lynx:lynx-jssdk:4.2.0")
    implementation("org.lynxsdk.lynx:lynx-trace:4.2.0")
    implementation("org.lynxsdk.lynx:primjs:4.2.1")

    // Log service saja. Tidak ada image/http/devtool service karena aplikasi
    // sepenuhnya offline dan tidak memakai <image> atau fetch.
    implementation("org.lynxsdk.lynx:lynx-service-log:4.2.0")
}
