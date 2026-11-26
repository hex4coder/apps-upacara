export interface StateTersimpan {
  cueAktif: number;
  volume: number;
  fade: number;
}

const KUNCI = 'upacara.state.v1';

type NativeStorage = typeof NativeModules.NativeUpacaraStorageModule;

interface PenyimpananSesi {
  getSessionStorageItem(key: string): unknown;
  setSessionStorageItem(key: string, value: object): void;
}

function storageNative(): NativeStorage | undefined {
  'background only';
  if (typeof NativeModules !== 'undefined' && NativeModules.NativeUpacaraStorageModule) {
    return NativeModules.NativeUpacaraStorageModule;
  }
  return undefined;
}

/**
 * Browser preview tidak punya localStorage, tetapi API session storage Lynx
 * tetap tersedia. Datanya bertahan selama LynxView/whiteboard hidup.
 */
function storageSesi(): PenyimpananSesi | undefined {
  'background only';
  if (typeof lynx === 'undefined') return undefined;
  const api = lynx as unknown as Partial<PenyimpananSesi>;
  if (
    typeof api.getSessionStorageItem === 'function'
    && typeof api.setSessionStorageItem === 'function'
  ) {
    return api as PenyimpananSesi;
  }
  return undefined;
}

function validasi(data: unknown): StateTersimpan | null {
  const nilai = data as Partial<StateTersimpan> | null | undefined;
  if (
    !nilai
    || typeof nilai.cueAktif !== 'number'
    || typeof nilai.volume !== 'number'
    || typeof nilai.fade !== 'number'
  ) {
    return null;
  }
  return {
    cueAktif: Math.max(1, Math.min(12, nilai.cueAktif)),
    volume: Math.max(0, Math.min(100, nilai.volume)),
    fade: Math.max(1, Math.min(10, nilai.fade)),
  };
}

function urai(nilai: string | null): StateTersimpan | null {
  if (!nilai) return null;
  try {
    return validasi(JSON.parse(nilai));
  } catch {
    return null;
  }
}

/** Baca progres upacara + setelan. Callback dipanggil di background thread. */
export function bacaState(callback: (state: StateTersimpan | null) => void): void {
  'background only';
  const native = storageNative();
  if (native) {
    native.getItem(KUNCI, (nilai) => callback(urai(nilai)));
    return;
  }
  const sesi = storageSesi();
  callback(sesi ? validasi(sesi.getSessionStorageItem(KUNCI)) : null);
}

/** Simpan progres upacara + setelan. */
export function simpanState(state: StateTersimpan): void {
  'background only';
  const native = storageNative();
  if (native) {
    native.setItem(KUNCI, JSON.stringify(state));
    return;
  }
  const sesi = storageSesi();
  if (sesi) {
    sesi.setSessionStorageItem(KUNCI, state);
  }
}
