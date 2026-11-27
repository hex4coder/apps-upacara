import { useCallback, useState } from '@lynx-js/react';
import { daftarCue, daftarLagu, durasiKeDetik, formatWaktu, kategoriFilter } from './data.js';
import type { Kategori, Lagu } from './data.js';

/* ---------------- Beranda ---------------- */

interface BerandaProps {
  onMulai: () => void;
  onLihatUrutan: () => void;
}

export function Beranda({ onMulai, onLihatUrutan }: BerandaProps) {
  return (
    <view className="layar">
      <view className="header">
        <view className="flag">
          <view className="flag-merah" />
          <view className="flag-putih" />
        </view>
        <view className="header-teks">
          <text className="judul">UPACARA</text>
          <text className="subjudul">Sound System · Senin</text>
        </view>
        <view className="pill-offline">
          <text className="pill-offline-label">OFFLINE</text>
        </view>
      </view>

      <view className="card kartu-waktu">
        <text className="teks-tanggal">Senin, 30 November 2026</text>
        <text className="teks-jam">07.00</text>
        <text className="teks-meta">Mulai dalam 3 hari 10 jam</text>
      </view>

      <view className="btn-primary" bindtap={onMulai}>
        <text className="btn-primary-label">MULAI UPACARA</text>
      </view>

      <view className="card kartu-urutan">
        <text className="card-judul">Urutan hari ini</text>
        {daftarCue.slice(0, 5).map((cue) => (
          <view className="cue-ringkas" key={cue.nomor}>
            <text className={cue.nomor === 3 ? 'cue-ringkas-no cue-ringkas-no--aktif' : 'cue-ringkas-no'}>
              {cue.nomor + '   ' + cue.judul}
            </text>
          </view>
        ))}
        <view className="tautan" bindtap={onLihatUrutan}>
          <text className="tautan-label">Lihat 12 langkah  →</text>
        </view>
      </view>

      <view className="card kartu-status">
        <text className="status-utama">Speaker: Bluetooth</text>
        <text className="status-sekunder">Volume 70% · Mode offline</text>
      </view>
    </view>
  );
}

/* ---------------- Pustaka Lagu ---------------- */

interface LaguProps {
  onPutar: (lagu: Lagu) => void;
}

function BarisLagu({ lagu, onPutar }: { lagu: Lagu; onPutar: (lagu: Lagu) => void }) {
  const putar = useCallback(() => {
    'background only';
    onPutar(lagu);
  }, [lagu, onPutar]);

  return (
    <view className="card baris-lagu" bindtap={putar}>
      <view className="nomor-lagu">
        <text className="nomor-lagu-label">▶</text>
      </view>
      <view className="info-lagu">
        <text className="lagu-judul">{lagu.judul}</text>
        <text className="lagu-meta">{lagu.pencipta + ' · ' + lagu.durasi}</text>
        <text className="lagu-kategori">{lagu.tersedia === false ? 'Tidak tersedia' : lagu.kategori}</text>
      </view>
    </view>
  );
}

export function PustakaLagu({ onPutar }: LaguProps) {
  const [kategori, setKategori] = useState<string>('Semua');

  const pilihKategori = useCallback((k: string) => {
    'background only';
    setKategori(k);
  }, []);

  const laguTampil = kategori === 'Semua'
    ? daftarLagu
    : daftarLagu.filter((lagu) => lagu.kategori === (kategori as Kategori));

  return (
    <view className="layar">
      <view className="header header--halaman">
        <text className="judul judul--halaman">Pustaka Lagu</text>
        <text className="subjudul">{daftarLagu.filter((lagu) => lagu.tersedia !== false).length + ' lagu tersedia offline'}</text>
      </view>

      <view className="kolom-cari">
        <text className="placeholder-cari">Cari judul atau pencipta...</text>
      </view>

      <view className="chip-row">
        {kategoriFilter.map((k) => (
          <view
            className={kategori === k ? 'chip chip--aktif' : 'chip'}
            bindtap={() => pilihKategori(k)}
            key={k}
          >
            <text className={kategori === k ? 'chip-label chip-label--aktif' : 'chip-label'}>{k}</text>
          </view>
        ))}
      </view>

      <scroll-view className="daftar-lagu" scroll-y>
        {laguTampil.map((lagu) => (
          <BarisLagu lagu={lagu} onPutar={onPutar} key={lagu.id} />
        ))}
      </scroll-view>
    </view>
  );
}

/* ---------------- Pemutar ---------------- */

interface PlayerProps {
  lagu: Lagu;
  sedangDiputar: boolean;
  posisi: number;
  cueAktif: number;
  volume: number;
  fadeDetik: number;
  onToggle: () => void;
  onKembali: () => void;
  onHentikan: () => void;
  onVolume: (delta: number) => void;
  onRestart: () => void;
  onFade: (arah: 'in' | 'out') => void;
}

export function Player({
  lagu,
  sedangDiputar,
  posisi,
  cueAktif,
  volume,
  fadeDetik,
  onToggle,
  onKembali,
  onHentikan,
  onVolume,
  onRestart,
  onFade,
}: PlayerProps) {
  const [konfirmasi, setKonfirmasi] = useState(false);
  const totalDetik = durasiKeDetik(lagu.durasi) || 1;
  const persentase = Math.min(100, Math.max(0, (posisi / totalDetik) * 100));

  const tambahVolume = useCallback(() => {
    'background only';
    onVolume(10);
  }, [onVolume]);
  const kurangVolume = useCallback(() => {
    'background only';
    onVolume(-10);
  }, [onVolume]);
  const fadeIn = useCallback(() => {
    'background only';
    onFade('in');
  }, [onFade]);
  const fadeOut = useCallback(() => {
    'background only';
    onFade('out');
  }, [onFade]);
  const ulang = useCallback(() => {
    'background only';
    onRestart();
  }, [onRestart]);
  const hentikan = useCallback(() => {
    'background only';
    if (konfirmasi) {
      onHentikan();
      setKonfirmasi(false);
    } else {
      setKonfirmasi(true);
    }
  }, [konfirmasi, onHentikan]);

  return (
    <view className="layar">
      <view className="header header--player">
        <view className="tombol-kembali" bindtap={onKembali}>
          <text className="tombol-kembali-label">‹</text>
        </view>
        <text className="judul judul--player">Sedang Diputar</text>
        <view className="chip-cue">
          <text className="chip-cue-label">Cue {cueAktif} dari 12</text>
        </view>
      </view>

      <view className="sampul">
        <view className="sampul-merah" />
        <view className="sampul-putih" />
      </view>

      <text className="player-judul">{lagu.judul}</text>
      <text className="player-pencipta">{lagu.pencipta + ' · Instrumental'}</text>

      <view className="progress-track">
        <view className="progress-isi" style={{ width: persentase + '%' }} />
      </view>
      <view className="progress-waktu">
        <text className="progress-waktu-label">{formatWaktu(posisi)}</text>
        <text className="progress-waktu-label">{lagu.durasi}</text>
      </view>

      <view className="kontrol">
        <view className="kontrol-samping" bindtap={ulang}>
          <text className="kontrol-samping-label">↺</text>
        </view>
        <view className="btn-putar" bindtap={onToggle}>
          <text className="btn-putar-label">{sedangDiputar ? '❚❚' : '▶'}</text>
        </view>
        <view className="kontrol-samping" bindtap={onKembali}>
          <text className="kontrol-samping-label">▶▶</text>
        </view>
      </view>

      <view className="card kartu-volume">
        <view className="baris-volume">
          <text className="volume-label">Volume</text>
          <text className="volume-angka">{volume + '%'}</text>
        </view>
        <view className="baris-volume">
          <view className="volume-track">
            <view className="volume-isi" style={{ width: volume + '%' }} />
          </view>
          <view className="volume-tombol" bindtap={kurangVolume}>
            <text className="volume-tombol-label">−</text>
          </view>
          <view className="volume-tombol" bindtap={tambahVolume}>
            <text className="volume-tombol-label">+</text>
          </view>
        </view>
      </view>

      <view className="aksi-row">
        <view className="aksi-chip" bindtap={fadeIn}>
          <text className="aksi-label">Fade In {fadeDetik}s</text>
        </view>
        <view className="aksi-chip" bindtap={fadeOut}>
          <text className="aksi-label">Fade Out {fadeDetik}s</text>
        </view>
        <view className="aksi-chip" bindtap={ulang}>
          <text className="aksi-label">Ulangi</text>
        </view>
      </view>

      <view className="btn-darurat" bindtap={hentikan}>
        <text className="btn-darurat-label">{konfirmasi ? 'YAKIN HENTIKAN?' : 'HENTIKAN SEMUA'}</text>
      </view>
    </view>
  );
}

/* ---------------- Urutan Upacara ---------------- */

interface UrutanProps {
  cueAktif: number;
  onLanjut: () => void;
  onLewati: () => void;
  onPutarLagu: (judul: string) => void;
}

export function UrutanUpacara({ cueAktif, onLanjut, onLewati, onPutarLagu }: UrutanProps) {
  const selesai = cueAktif - 1;

  const putarCue = useCallback((judul: string) => {
    'background only';
    onPutarLagu(judul);
  }, [onPutarLagu]);

  return (
    <view className="layar">
      <view className="header header--halaman">
        <text className="judul judul--halaman">Urutan Upacara</text>
        <text className="subjudul">{selesai + ' dari 12 selesai'}</text>
        <view className="progress-track progress-track--atas">
          <view className="progress-isi" style={{ width: (selesai / 12) * 100 + '%' }} />
        </view>
      </view>

      <scroll-view className="daftar-cue" scroll-y>
        {daftarCue.map((cue) => {
          const aktif = cue.nomor === cueAktif;
          const sudah = cue.nomor < cueAktif;
          return (
            <view
              className={aktif ? 'card cue cue--aktif' : 'card cue'}
              key={cue.nomor}
              bindtap={cue.lagu ? () => putarCue(cue.lagu!) : undefined}
            >
              <view className={sudah || aktif ? 'cue-status cue-status--aktif' : 'cue-status'}>
                <text className="cue-status-label">{sudah ? '✓' : String(cue.nomor)}</text>
              </view>
              <view className="cue-info">
                <text className={aktif ? 'cue-judul cue-judul--aktif' : 'cue-judul'}>
                  {cue.judul}
                </text>
                <text className={aktif ? 'cue-catatan cue-catatan--aktif' : 'cue-catatan'}>
                  {cue.catatan}
                </text>
              </view>
              <text className="cue-jam">{cue.jam}</text>
            </view>
          );
        })}
      </scroll-view>

      <view className="btn-primary btn-primary--aksi" bindtap={onLanjut}>
        <text className="btn-primary-label">Tandai Selesai & Lanjut</text>
      </view>
      <view className="aksi-row aksi-row--bawah">
        <view className="aksi-chip" bindtap={onLewati}>
          <text className="aksi-label">Lewati</text>
        </view>
        <view className="aksi-chip" bindtap={onLanjut}>
          <text className="aksi-label">Ulangi Cue</text>
        </view>
      </view>
    </view>
  );
}

/* ---------------- Setelan ---------------- */

interface SetelanProps {
  fade: number;
  volume: number;
  onFade: (value: number) => void;
  onAksi: (pesan: string) => void;
}

export function Setelan({ fade, volume, onFade, onAksi }: SetelanProps) {
  const pilihFade = useCallback((value: number) => {
    'background only';
    onFade(value);
  }, [onFade]);
  const simpan = useCallback(() => {
    'background only';
    onAksi('Pengaturan disimpan');
  }, [onAksi]);

  return (
    <view className="layar">
      <view className="header header--halaman">
        <text className="judul judul--halaman">Setelan</text>
        <text className="subjudul">Sesuaikan sebelum upacara</text>
      </view>

      <view className="card baris-setelan">
        <text className="setelan-judul">Durasi fade</text>
        <view className="aksi-row aksi-row--setelan">
          {[2, 3, 5].map((value) => (
            <view
              className={fade === value ? 'aksi-chip aksi-chip--aktif' : 'aksi-chip'}
              bindtap={() => pilihFade(value)}
              key={value}
            >
              <text className="aksi-label">{value + ' detik'}</text>
            </view>
          ))}
        </view>
      </view>

      <view className="card baris-setelan">
        <text className="setelan-judul">Volume maksimal aman</text>
        <text className="setelan-nilai">{volume + '%'}</text>
      </view>

      <view className="card baris-setelan">
        <text className="setelan-judul">Perangkat audio</text>
        <text className="setelan-nilai">Bluetooth</text>
      </view>

      <view className="card baris-setelan">
        <text className="setelan-judul">Kontras tinggi</text>
        <text className="setelan-nilai">Aktif</text>
      </view>

      <view className="btn-primary" bindtap={simpan}>
        <text className="btn-primary-label">SIMPAN PENGATURAN</text>
      </view>
    </view>
  );
}
