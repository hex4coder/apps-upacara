/**
 * Kontrol audio aplikasi Upacara.
 *
 * - Android / Lynx host: memanggil NativeUpacaraAudioModule (MediaPlayer) dan
 *   membaca posisi asli lewat getCurrentPosition.
 * - Lynx for Web: TIDAK ada Web Audio / window di runtime Lynx, jadi memakai
 *   simulasi berbasis timer agar progress bar dan kontrol tetap bisa diuji.
 *
 * Semua fungsi yang menyentuh NativeModules ditandai 'background only'.
 */

type ArahFade = 'in' | 'out';
type ModeAudio = 'native' | 'simulasi';

type NativeAudio = typeof NativeModules.NativeUpacaraAudioModule;

let sedangAktif = false;
let mulaiPada = 0;
let offsetDetik = 0;
let volumePersen = 70;
let idLagu = '';
let timerFade: ReturnType<typeof setTimeout> | null = null;
let timerPosisi: ReturnType<typeof setInterval> | null = null;
let posisiNativeMs = 0;

function audioNative(): NativeAudio | undefined {
  'background only';
  if (typeof NativeModules !== 'undefined' && NativeModules.NativeUpacaraAudioModule) {
    return NativeModules.NativeUpacaraAudioModule;
  }
  return undefined;
}

export function modeAudio(): ModeAudio {
  'background only';
  return audioNative() ? 'native' : 'simulasi';
}

function batasVolume(nilai: number): number {
  return Math.max(0, Math.min(100, Math.round(nilai)));
}

function batalkanFade(): void {
  'background only';
  if (timerFade !== null) {
    clearTimeout(timerFade);
    timerFade = null;
  }
}

function hentikanPantauPosisi(): void {
  'background only';
  if (timerPosisi !== null) {
    clearInterval(timerPosisi);
    timerPosisi = null;
  }
}

function mulaiPantauPosisi(native: NativeAudio): void {
  'background only';
  hentikanPantauPosisi();
  posisiNativeMs = 0;
  timerPosisi = setInterval(() => {
    native.getCurrentPosition((ms) => {
      posisiNativeMs = ms;
    });
  }, 500);
}

/** Mulai memutar lagu. Di Android, `id` dipetakan ke assets/audio/<id>.mp3. */
export function putar(id: string, volume: number): boolean {
  'background only';
  batalkanFade();
  idLagu = id;
  volumePersen = batasVolume(volume);
  offsetDetik = 0;
  mulaiPada = Date.now();

  const native = audioNative();
  if (native) {
    native.setVolume(volumePersen);
    native.play(id, volumePersen);
    mulaiPantauPosisi(native);
  }
  // Di browser ini simulasi: tidak menghasilkan suara, hanya progress.
  sedangAktif = true;
  return true;
}

export function jeda(): void {
  'background only';
  const native = audioNative();
  if (native) {
    native.getCurrentPosition((ms) => {
      posisiNativeMs = ms;
    });
    native.pause();
    hentikanPantauPosisi();
  } else if (sedangAktif) {
    offsetDetik += (Date.now() - mulaiPada) / 1000;
  }
  sedangAktif = false;
}

export function lanjutkan(): boolean {
  'background only';
  if (!idLagu) return false;
  const native = audioNative();
  if (native) {
    native.resume();
    mulaiPantauPosisi(native);
  } else {
    mulaiPada = Date.now();
  }
  sedangAktif = true;
  return true;
}

export function hentikan(): void {
  'background only';
  batalkanFade();
  hentikanPantauPosisi();
  posisiNativeMs = 0;
  const native = audioNative();
  if (native) native.stop();
  sedangAktif = false;
  offsetDetik = 0;
}

export function ubahVolume(volume: number): void {
  'background only';
  volumePersen = batasVolume(volume);
  const native = audioNative();
  if (native) native.setVolume(volumePersen);
}

export function fade(detik: number, arah: ArahFade): void {
  'background only';
  batalkanFade();
  const durasi = Math.max(1, detik);
  const native = audioNative();
  if (native) {
    native.fade(Math.round(durasi * 1000), arah);
    return;
  }
  if (arah === 'out') {
    timerFade = setTimeout(() => {
      sedangAktif = false;
      offsetDetik = 0;
      timerFade = null;
    }, durasi * 1000);
  }
}

export function ulangi(): boolean {
  'background only';
  batalkanFade();
  hentikanPantauPosisi();
  posisiNativeMs = 0;
  offsetDetik = 0;
  mulaiPada = Date.now();
  sedangAktif = Boolean(idLagu);
  const native = audioNative();
  if (native && idLagu) {
    native.stop();
    native.play(idLagu, volumePersen);
    mulaiPantauPosisi(native);
  }
  return sedangAktif;
}

/** Posisi dalam detik, dipakai untuk progress bar di UI. */
export function posisiDetik(): number {
  'background only';
  const native = audioNative();
  if (native && posisiNativeMs > 0) return posisiNativeMs / 1000;
  if (!sedangAktif) return offsetDetik;
  return offsetDetik + (Date.now() - mulaiPada) / 1000;
}
