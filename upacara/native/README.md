# Native Modules Android — Upacara

Folder ini berisi source native yang diperlukan supaya aplikasi Lynx bisa:

1. Memutar file audio lokal dengan `MediaPlayer`.
2. Menyimpan progres cue dan setelan dengan `SharedPreferences`.

Keduanya **tidak memerlukan izin `INTERNET`**.

## Daftar file

```text
native/android/
├── NativeUpacaraAudioModule.kt
└── NativeUpacaraStorageModule.kt
```

## 1. Hubungkan ke host Android

Host di [`../android/`](../android/) sudah memakai folder ini langsung lewat:

```kotlin
// ../android/app/build.gradle.kts
sourceSets {
    getByName("main") {
        java.srcDir("../../native/android")
    }
}
```

Jadi tidak perlu menyalin file. Jika memakai host lain, salin kedua file Kotlin ke `app/src/main/java/<package>/` dan sesuaikan `package` serta import.

## 2. Daftarkan modul saat `LynxEnv` diinisialisasi

Pada host ini, registrasi ada di [`../android/app/src/main/java/com/hex4coder/upacara/UpacaraApplication.kt`](../android/app/src/main/java/com/hex4coder/upacara/UpacaraApplication.kt). Untuk Lynx Explorer, tambahkan ke `LynxModuleAdapter.Init(context)`:

```kotlin
LynxEnv.inst().registerModule(
    "NativeUpacaraAudioModule",
    NativeUpacaraAudioModule::class.java,
)
LynxEnv.inst().registerModule(
    "NativeUpacaraStorageModule",
    NativeUpacaraStorageModule::class.java,
)
```

Nama registrasi **harus sama persis** dengan deklarasi di `src/typing.d.ts`.

## 3. Letakkan file audio

Modul audio mencari file di:

```text
app/src/main/assets/audio/<id>.mp3
```

Id yang dipakai aplikasi:

| Id | Judul |
| --- | --- |
| `indonesia-raya` | Indonesia Raya |
| `mengheningkan-cipta` | Mengheningkan Cipta |
| `garuda-pancasila` | Garuda Pancasila |
| `gugur-bunga` | Gugur Bunga |
| `bangun-pemudi-pemuda` | Bangun Pemudi Pemuda |
| `maju-tak-gentar` | Maju Tak Gentar |
| `tanah-airku` | Tanah Airku |
| `doa-khidmat` | Doa (Nada Khidmat) |

> Gunakan rekaman sendiri atau aransemen instrumental yang legal. Jangan menyertakan rekaman berhak cipta tanpa izin.

## 4. Bridge TypeScript ↔ Kotlin

Deklarasi JavaScript ada di `src/typing.d.ts`. Pemanggilan dibungkus di:

- `src/lib/audio.ts`
- `src/lib/storage.ts`

Semua fungsi yang memanggil `NativeModules` sudah ditandai `'background only'`, sesuai persyaratan Lynx.

## 5. Perilaku di browser

Karena `NativeModules` tidak ada di Lynx for Web, dan runtime Lynx juga **tidak menyediakan `window`, `localStorage`, atau Web Audio**:

- audio fallback ke **simulasi timer** (progress bar berjalan, tanpa suara);
- storage fallback ke **`lynx` session storage** (bertahan selama whiteboard hidup).

Dengan demikian UI tetap bisa diuji di browser tanpa APK, dan pesan "(simulasi)" ditampilkan saat lagu diputar.

## 6. Host Android

Host Gradle ada di [`../android/`](../android/). Ia memuat `main.lynx.bundle` dari `assets/`, mendaftarkan kedua modul, dan tidak meminta izin `INTERNET`. `MainActivity` memanggil `NativeUpacaraAudioModule.hentikanSemua()` dan `lynxView.destroy()` saat Activity dihancurkan agar audio tidak berlanjut dan memory engine dilepaskan. Posisi `MediaPlayer` dibaca lewat `getCurrentPosition` oleh adapter audio.

Referensi: <https://lynxjs.org/next/guide/use-native-modules>
