export type Kategori = 'Nasional' | 'Khidmat' | 'Mars' | 'Pengiring' | 'Lainnya';

export interface Lagu {
  id: string;
  judul: string;
  pencipta: string;
  durasi: string;
  kategori: Kategori;
}

export const daftarLagu: Lagu[] = [
  { id: 'indonesia-raya', judul: 'Indonesia Raya', pencipta: 'W. R. Supratman', durasi: '3:24', kategori: 'Nasional' },
  { id: 'mengheningkan-cipta', judul: 'Mengheningkan Cipta', pencipta: 'Truno Prawit', durasi: '2:58', kategori: 'Khidmat' },
  { id: 'garuda-pancasila', judul: 'Garuda Pancasila', pencipta: 'Sudharnoto', durasi: '3:10', kategori: 'Nasional' },
  { id: 'gugur-bunga', judul: 'Gugur Bunga', pencipta: 'Ismail Marzuki', durasi: '4:05', kategori: 'Khidmat' },
  { id: 'bangun-pemudi-pemuda', judul: 'Bangun Pemudi Pemuda', pencipta: 'Alfred Simanjuntak', durasi: '2:41', kategori: 'Mars' },
  { id: 'maju-tak-gentar', judul: 'Maju Tak Gentar', pencipta: 'Cornel Simanjuntak', durasi: '2:32', kategori: 'Mars' },
  { id: 'tanah-airku', judul: 'Tanah Airku', pencipta: 'Ibu Soed', durasi: '3:36', kategori: 'Nasional' },
  { id: 'doa-khidmat', judul: 'Doa (Nada Khidmat)', pencipta: 'Aransemen sekolah', durasi: '1:48', kategori: 'Khidmat' },
];

export const kategoriFilter = ['Semua', 'Nasional', 'Khidmat', 'Mars', 'Pengiring'] as const;

export interface Cue {
  nomor: number;
  jam: string;
  judul: string;
  catatan: string;
  lagu?: string;
}

export const daftarCue: Cue[] = [
  { nomor: 1, jam: '07.00', judul: 'Pembukaan oleh MC', catatan: 'Mic aktif · volume 60%' },
  { nomor: 2, jam: '07.03', judul: 'Pengibaran bendera', catatan: 'Indonesia Raya · fade 3s', lagu: 'Indonesia Raya' },
  { nomor: 3, jam: '07.07', judul: 'Mengheningkan cipta', catatan: 'Mengheningkan Cipta · fade 5s', lagu: 'Mengheningkan Cipta' },
  { nomor: 4, jam: '07.10', judul: 'UUD 1945 & Pancasila', catatan: 'Diam · siapkan lagu berikutnya' },
  { nomor: 5, jam: '07.15', judul: 'Laporan kepala sekolah', catatan: 'Mic aktif' },
  { nomor: 6, jam: '07.22', judul: 'Amanat kepala sekolah', catatan: 'Mic aktif · pantau kabel' },
  { nomor: 7, jam: '07.32', judul: 'Pengumuman', catatan: 'Mic aktif' },
  { nomor: 8, jam: '07.38', judul: 'Lagu nasional pilihan', catatan: 'Pilih sesuai tema minggu', lagu: 'Garuda Pancasila' },
  { nomor: 9, jam: '07.42', judul: 'Penurunan bendera', catatan: 'Indonesia Raya instrumental', lagu: 'Indonesia Raya' },
  { nomor: 10, jam: '07.46', judul: 'Doa', catatan: 'Fade out sebelum amin', lagu: 'Doa (Nada Khidmat)' },
  { nomor: 11, jam: '07.49', judul: 'Penutupan', catatan: 'Mic aktif' },
  { nomor: 12, jam: '07.52', judul: 'Selesai + evaluasi', catatan: 'Tekan Selesaikan Upacara' },
];
