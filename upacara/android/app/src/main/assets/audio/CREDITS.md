# Kredit dan Lisensi Audio

Semua audio yang dikirim bersama APK disimpan lokal di
`upacara/android/app/src/main/assets/audio/<id>.mp3`. Aplikasi tidak mengunduh,
mengalirkan, atau memerlukan izin `INTERNET`.

Kebijakan lisensi proyek: hanya **public domain / CC0 / CC BY / CC BY-NC** yang
diperbolehkan. Rekaman berlisensi `none`, `arr`, atau CC BY-NC-SA **tidak**
dimasukkan.

## Daftar audio produksi

| ID | File | Judul rekaman | Pencipta / pemeran | Sumber | Lisensi | Durasi |
| --- | --- | --- | --- | --- | --- | --- |
| `indonesia-raya` | `indonesia-raya.mp3` | Indonesia Raya (instrumental) | W. R. Soepratman (lagu); United States Navy Band (rekaman) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Indonesia_Raya_instrumental.ogg) | Public domain (menurut halaman berkas) | 1:49 |
| `mengheningkan-cipta` | `mengheningkan-cipta.mp3` | Mengheningkan Cipta (Hymne Pahlawan) – 2 Suara | Truno Prawit (lagu); Guru Giri (rekaman) | [audio.com](https://audio.com/guru-giri/audio/mengheningkan-cipta) · [metadata API](https://api.audio.com/audio/1814802660449364) | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) | 2:03 |
| `garuda-pancasila` | `garuda-pancasila.mp3` | Lagu Nasional RI – Garuda Pancasila | Sudharnoto (lagu); uploader Internet Archive (rekaman) | [Internet Archive: Lagu Nasional Republik Indonesia](https://archive.org/details/LaguNasionalRepublikIndonesia) | [Public Domain Mark 1.0](https://creativecommons.org/publicdomain/mark/1.0/) | 3:14 |
| `bangun-pemudi-pemuda` | `bangun-pemudi-pemuda.mp3` | Lagu Nasional RI # Bangun Pemudi Pemuda | Alfred Simanjuntak (lagu); uploader Internet Archive (rekaman) | [Internet Archive: Lagu Nasional Republik Indonesia](https://archive.org/details/LaguNasionalRepublikIndonesia) | [Public Domain Mark 1.0](https://creativecommons.org/publicdomain/mark/1.0/) | 3:34 |
| `maju-tak-gentar` | `maju-tak-gentar.mp3` | Lagu Nasional RI # Maju Tak Gentar (Instrumental) | Cornel Simanjuntak (lagu); uploader Internet Archive (rekaman) | [Internet Archive: Lagu Nasional Republik Indonesia](https://archive.org/details/LaguNasionalRepublikIndonesia) | [Public Domain Mark 1.0](https://creativecommons.org/publicdomain/mark/1.0/) | 3:39 |
| `tanah-airku` | `tanah-airku.mp3` | Lagu Nasional RI # Tanah Airku | Ibu Soed / Saridjah Niung (lagu); uploader Internet Archive (rekaman) | [Internet Archive: Lagu Nasional Republik Indonesia](https://archive.org/details/LaguNasionalRepublikIndonesia) | [Public Domain Mark 1.0](https://creativecommons.org/publicdomain/mark/1.0/) | 3:59 |
| `doa-khidmat` | `doa-khidmat.mp3` | Nada Khidmat (paduan nada sinus halus) | Dibuat khusus untuk proyek ini | Sintesis lokal dengan FFmpeg; tanpa sumber pihak ketiga | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 1:48 |

Catatan istilah: **Mengheningkan Cipta** adalah judul yang benar, bukan “Hening
Cipta”. Rekaman Guru Giri memakai CC BY-NC, sehingga penggunaan komersial tidak
diizinkan; atribusi ini wajib disertakan bersama APK.

## Tidak disertakan

- **`gugur-bunga`** — tidak ada rekaman yang memenuhi kebijakan lisensi proyek.
  Kandidat dari Archive.org (album *Merdeka Tanah Airku 2010*) berlisensi
  **CC BY-NC-SA 3.0**, yaitu di luar batas CC BY-NC murni, sehingga tidak
  dipakai. Banyak hasil lain bertanda `none`/`arr` atau judulnya tidak cocok.
  Entri tetap tampil di pustaka sebagai “Tidak tersedia” agar Operator tidak
  menekan tombol yang tidak menghasilkan suara.

## Catatan konversi

Semua berkas sumber dikonversi dengan FFmpeg menjadi **MP3 mono, 44,1 kHz,
~96 kbps**:

```sh
ffmpeg -i sumber.ogg -vn -ac 1 -ar 44100 -b:a 96k audio/<id>.mp3
```

Untuk `doa-khidmat`, nada disintesis dengan `aevalsrc` (220, 277,18, dan
329,63 Hz) lalu diberi fade in 3 detik dan fade out 4 detik. Konversi format
ini tidak mengubah atribusi lisensi rekaman asal.

## Integritas berkas (SHA-256)

```text
2bfed7bf806f928fa096934b310e3db4385ea2f11c74bac2090d35185d4f9ae7  indonesia-raya.mp3
94eec9080a85fe392c3ee5a1d99079becb8f89ef8612cb20e2422fb242c1e635  mengheningkan-cipta.mp3
dd0a3eb935bb7e148931c1b261e7f47c890f19f914797f266f086ca77a78a75c  garuda-pancasila.mp3
94899e429946df7805318fece12bc980352638564d18b14e46833a49b4789107  bangun-pemudi-pemuda.mp3
90056c44c9bf3f454e563165f6a436b8ea779f981ca0fced9ef4ae3d64f9b73b  maju-tak-gentar.mp3
70596669cc017435f150a6b7cd0e619aa1ebe49fb7222738c2a760b5fd9d147f  tanah-airku.mp3
4c2b6d34d0ad63d43e87c75208cf41eceeaa727890fa405191307e60813cb863  doa-khidmat.mp3
```

Salinan ringkas juga disimpan di
`upacara/android/app/src/main/assets/audio/CREDITS.md`.
