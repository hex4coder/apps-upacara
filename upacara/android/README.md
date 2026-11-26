# Host Android — Upacara

Project Android brownfield yang memuat bundle Lynx aplikasi Upacara di dalam `LynxView`.

## Prasyarat

- Android Studio dengan **Android SDK 34** terpasang.
- **JDK 17**.
- Bun ≥ 1.4 untuk membangun bundle JavaScript.
- Gradle wrapper 8.7 sudah disertakan, jadi tidak perlu install Gradle global.

## Menjalankan build

Dari folder `upacara/`:

```bash
bun install
bun run sync:android
cd android
./gradlew assembleDebug
```

APK debug ada di `app/build/outputs/apk/debug/app-debug.apk`.

Untuk memasang ke perangkat yang terhubung:

```bash
./gradlew installDebug
```

`sync:android` melakukan `bun run build` lalu menyalin `dist/main.lynx.bundle` ke
`app/src/main/assets/main.lynx.bundle`. Jalankan ulang setiap kali UI TypeScript diubah.

## Struktur penting

```text
android/
├── app/src/main/assets/
│   ├── main.lynx.bundle      # hasil bun run sync:android
│   └── audio/                # taruh <id>.mp3 di sini
├── app/src/main/java/com/hex4coder/upacara/
│   ├── UpacaraApplication.kt # init LynxEnv + registrasi native module
│   ├── MainActivity.kt       # LynxView + lifecycle
│   └── UpacaraTemplateProvider.kt
├── app/src/main/AndroidManifest.xml
└── app/proguard-rules.pro
```

Source kanonik native module tidak disalin, melainkan dirujuk langsung dari
`../native/android` lewat `sourceSets` di `app/build.gradle.kts`.

## Native module

Dua modul didaftarkan di `UpacaraApplication` dengan nama yang harus sama persis
dengan `upacara/src/typing.d.ts`:

- `NativeUpacaraAudioModule` — `MediaPlayer`, volume, fade, dan posisi.
- `NativeUpacaraStorageModule` — `SharedPreferences` untuk progres cue dan setelan.

Keduanya hanya boleh dipanggil dari background thread. Adapter di `upacara/src/lib/`
sudah menandai fungsinya dengan `'background only'`.

## Audio lokal

Taruh file audio legal di:

```text
app/src/main/assets/audio/<id>.mp3
```

Id yang dipakai: `indonesia-raya`, `mengheningkan-cipta`, `garuda-pancasila`,
`gugur-bunga`, `bangun-pemudi-pemuda`, `maju-tak-gentar`, `tanah-airku`, `doa-khidmat`.

Jika file belum ada, aplikasi tetap berjalan dan modul audio hanya mencatat peringatan;
progress bar di browser memakai simulasi timer.

## Offline dan izin

`AndroidManifest.xml` **sengaja tidak meminta izin `INTERNET`**. Bundle, audio, dan
penyimpanan semuanya lokal. Jangan menambahkan HTTP service atau devtool service
ke host produksi.

## Dependensi engine

Versi engine di `app/build.gradle.kts` adalah Lynx 4.2.0 (primjs 4.2.1), lebih baru
dari `engineVersion`/`targetSdkVersion` bundle (3.2). Jika bundle dan engine
diperbarui, jaga keduanya tetap kompatibel.

Referensi: <https://lynxjs.org/next/guide/start/integrate-with-existing-apps.md>
