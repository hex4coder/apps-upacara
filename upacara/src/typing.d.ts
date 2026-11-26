/**
 * Deklarasi Native Modules Lynx untuk aplikasi Upacara.
 * Implementasi Android ada di `native/android/`.
 *
 * CATATAN: NativeModules hanya bisa dipanggil dari background thread
 * (event handler, useEffect, atau fungsi dengan directive 'background only').
 */
declare let NativeModules: {
  NativeUpacaraAudioModule: {
    play(id: string, volume: number): void;
    pause(): void;
    resume(): void;
    stop(): void;
    setVolume(volume: number): void;
    fade(durationMs: number, direction: 'in' | 'out'): void;
    getCurrentPosition(callback: (positionMs: number) => void): void;
  };
  NativeUpacaraStorageModule: {
    setItem(key: string, value: string): void;
    getItem(key: string, callback: (value: string | null) => void): void;
  };
};
