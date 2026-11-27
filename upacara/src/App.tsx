import { useCallback, useEffect, useState } from '@lynx-js/react';
import './App.css';
import { daftarLagu, durasiKeDetik } from './data.js';
import type { Lagu } from './data.js';
import * as audio from './lib/audio.js';
import { bacaState, simpanState } from './lib/storage.js';
import { Beranda, Player, PustakaLagu, Setelan, UrutanUpacara } from './screens.js';
import { NavBar } from './ui.js';
import type { Screen } from './ui.js';

export function App() {
  const [screen, setScreen] = useState<Screen>('beranda');
  const [lagu, setLagu] = useState<Lagu>(daftarLagu[0]);
  const [sedangDiputar, setSedangDiputar] = useState(false);
  const [posisi, setPosisi] = useState(0);
  const [volume, setVolume] = useState(70);
  const [cueAktif, setCueAktif] = useState(1);
  const [fade, setFade] = useState(3);
  const [pesan, setPesan] = useState('');
  const [stateDimuat, setStateDimuat] = useState(false);

  const tampilkanPesan = useCallback((teks: string) => {
    'background only';
    setPesan(teks);
  }, []);

  const navigasi = useCallback((tujuan: Screen) => {
    'background only';
    setScreen(tujuan);
    setPesan('');
  }, []);

  const mulaiUpacara = useCallback(() => {
    'background only';
    setCueAktif(1);
    setScreen('urutan');
    setPesan('Upacara dimulai · cue 1 aktif');
  }, []);

  const putarLagu = useCallback((pilihan: Lagu) => {
    'background only';
    if (pilihan.tersedia === false) {
      setPesan('Audio tidak tersedia: ' + pilihan.judul + ' · lihat AUDIO_CREDITS.md');
      return;
    }
    const berhasil = audio.putar(pilihan.id, volume);
    const mode = audio.modeAudio();
    setLagu(pilihan);
    setPosisi(0);
    setSedangDiputar(berhasil);
    setScreen('player');
    setPesan(
      berhasil
        ? 'Memutar: ' + pilihan.judul + (mode === 'simulasi' ? ' (simulasi)' : '')
        : 'Audio belum tersedia di host ini',
    );
  }, [volume]);

  const putarJudul = useCallback((judul: string) => {
    'background only';
    const ditemukan = daftarLagu.find((item) => item.judul === judul);
    if (ditemukan) {
      putarLagu(ditemukan);
    } else {
      setPesan('Lagu belum tersedia: ' + judul);
    }
  }, [putarLagu]);

  const togglePutar = useCallback(() => {
    'background only';
    if (sedangDiputar) {
      audio.jeda();
      setSedangDiputar(false);
      setPesan('Dijeda');
      return;
    }
    const berhasil = audio.lanjutkan();
    if (berhasil) {
      setSedangDiputar(true);
      setPesan('Dilanjutkan');
    } else {
      setPesan('Tidak ada lagu untuk dilanjutkan');
    }
  }, [sedangDiputar]);

  const ubahVolume = useCallback((delta: number) => {
    'background only';
    const berikutnya = Math.max(0, Math.min(100, volume + delta));
    setVolume(berikutnya);
    audio.ubahVolume(berikutnya);
  }, [volume]);

  const lanjutCue = useCallback(() => {
    'background only';
    setCueAktif((nilai) => Math.min(12, nilai + 1));
    setPesan('Cue berikutnya aktif');
  }, []);

  const lewatiCue = useCallback(() => {
    'background only';
    setCueAktif((nilai) => Math.min(12, nilai + 1));
    setPesan('Cue dilewati');
  }, []);

  const restartLagu = useCallback(() => {
    'background only';
    const berhasil = audio.ulangi();
    setPosisi(0);
    setSedangDiputar(berhasil);
    setPesan('Lagu diulang dari awal');
  }, []);

  const jalankanFade = useCallback((arah: 'in' | 'out') => {
    'background only';
    audio.fade(fade, arah);
    if (arah === 'out') {
      setTimeout(() => setSedangDiputar(false), fade * 1000);
    }
    setPesan(arah === 'in'
      ? 'Fade in ' + fade + ' detik'
      : 'Fade out ' + fade + ' detik');
  }, [fade]);

  const hentikanSemua = useCallback(() => {
    'background only';
    audio.hentikan();
    setSedangDiputar(false);
    setPosisi(0);
    setVolume(70);
    audio.ubahVolume(70);
    setPesan('Semua audio dihentikan · volume 70%');
  }, []);

  const ubahFade = useCallback((nilai: number) => {
    'background only';
    setFade(nilai);
    setPesan('Fade default: ' + nilai + ' detik');
  }, []);

  const simpanPengaturan = useCallback(() => {
    'background only';
    simpanState({ cueAktif, volume, fade });
    setPesan('Pengaturan disimpan');
  }, [cueAktif, volume, fade]);

  // Pulihkan progres & setelan dari SharedPreferences (native) atau localStorage (browser).
  useEffect(() => {
    bacaState((state) => {
      if (state) {
        setCueAktif(state.cueAktif);
        setVolume(state.volume);
        setFade(state.fade);
        audio.ubahVolume(state.volume);
      }
      setStateDimuat(true);
    });
  }, []);

  useEffect(() => {
    if (!stateDimuat) return;
    simpanState({ cueAktif, volume, fade });
  }, [stateDimuat, cueAktif, volume, fade]);

  // Progress bar mengikuti posisi audio yang sebenarnya.
  useEffect(() => {
    if (!sedangDiputar) return;
    const total = durasiKeDetik(lagu.durasi);
    const timer = setInterval(() => {
      setPosisi(Math.min(total, audio.posisiDetik()));
    }, 1000);
    return () => clearInterval(timer);
  }, [sedangDiputar, lagu]);

  return (
    <view className="app-root">
      {screen === 'beranda' && (
        <Beranda onMulai={mulaiUpacara} onLihatUrutan={() => navigasi('urutan')} />
      )}
      {screen === 'lagu' && <PustakaLagu onPutar={putarLagu} />}
      {screen === 'player' && (
        <Player
          lagu={lagu}
          sedangDiputar={sedangDiputar}
          posisi={posisi}
          cueAktif={cueAktif}
          volume={volume}
          fadeDetik={fade}
          onToggle={togglePutar}
          onKembali={() => navigasi('lagu')}
          onHentikan={hentikanSemua}
          onVolume={ubahVolume}
          onRestart={restartLagu}
          onFade={jalankanFade}
        />
      )}
      {screen === 'urutan' && (
        <UrutanUpacara
          cueAktif={cueAktif}
          onLanjut={lanjutCue}
          onLewati={lewatiCue}
          onPutarLagu={putarJudul}
        />
      )}
      {screen === 'setelan' && (
        <Setelan
          fade={fade}
          volume={volume}
          onFade={ubahFade}
          onAksi={simpanPengaturan}
        />
      )}

      {pesan !== '' && (
        <view className="toast">
          <text className="toast-label">{pesan}</text>
        </view>
      )}

      {screen !== 'player' && <NavBar screen={screen} onNavigate={navigasi} />}
    </view>
  );
}
