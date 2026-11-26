import { useCallback, useState } from '@lynx-js/react';
import './App.css';
import { daftarLagu } from './data.js';
import type { Lagu } from './data.js';
import { Beranda, Player, PustakaLagu, Setelan, UrutanUpacara } from './screens.js';
import { NavBar } from './ui.js';
import type { Screen } from './ui.js';

export function App() {
  const [screen, setScreen] = useState<Screen>('beranda');
  const [lagu, setLagu] = useState<Lagu>(daftarLagu[0]);
  const [sedangDiputar, setSedangDiputar] = useState(false);
  const [volume, setVolume] = useState(70);
  const [cueAktif, setCueAktif] = useState(3);
  const [fade, setFade] = useState(3);
  const [pesan, setPesan] = useState('');

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
    setLagu(pilihan);
    setSedangDiputar(true);
    setScreen('player');
    setPesan('Memutar: ' + pilihan.judul);
  }, []);

  const putarJudul = useCallback((judul: string) => {
    'background only';
    const ditemukan = daftarLagu.find((item) => item.judul === judul);
    if (ditemukan) {
      setLagu(ditemukan);
      setSedangDiputar(true);
      setScreen('player');
      setPesan('Memutar: ' + judul);
    } else {
      setPesan('Lagu belum tersedia: ' + judul);
    }
  }, []);

  const togglePutar = useCallback(() => {
    'background only';
    setSedangDiputar((nilai) => !nilai);
  }, []);

  const ubahVolume = useCallback((delta: number) => {
    'background only';
    setVolume((nilai) => Math.max(0, Math.min(100, nilai + delta)));
  }, []);

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

  const hentikanSemua = useCallback(() => {
    'background only';
    setSedangDiputar(false);
    setVolume(70);
    setPesan('Semua audio dihentikan · volume 70%');
  }, []);

  const tampilkanPesan = useCallback((teks: string) => {
    'background only';
    setPesan(teks);
  }, []);

  const ubahFade = useCallback((nilai: number) => {
    'background only';
    setFade(nilai);
    setPesan('Fade default: ' + nilai + ' detik');
  }, []);

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
          volume={volume}
          onToggle={togglePutar}
          onKembali={() => navigasi('lagu')}
          onHentikan={hentikanSemua}
          onVolume={ubahVolume}
          onAksi={tampilkanPesan}
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
        <Setelan fade={fade} volume={volume} onFade={ubahFade} onAksi={tampilkanPesan} />
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
