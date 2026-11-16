import { teamMembers } from './team.js'

/**
 * Data Proyek Awal (Default Initial Projects) Kelompok 3
 * Diambil secara autentik dari LinkedIn dan GitHub (@PanjulAja) Zulfa Yafiansyah
 * serta proyek kolaborasi tim.
 */
export const initialProjects = [
  // ── 1. SehatYuk (LinkedIn) ──
  {
    id: 1,
    slug: 'sehatyuk-health-platform',
    title: 'SehatYuk — Web-Based Health Platform',
    type: 'Team',
    shortDesc: 'Platform layanan kesehatan berbasis web untuk konsultasi medis, reservasi jadwal dokter, dan rekam medis digital.',
    description:
      'SehatYuk adalah platform kesehatan terintegrasi berbasis web yang dirancang untuk mempermudah pasien melakukan temu janji dokter, memantau rekam medis pribadi, dan mengelola operasional klinik kesehatan secara daring.',
    category: 'Web App',
    tags: ['Web', 'Healthtech', 'Laravel', 'Telkom University'],
    tech: ['Laravel', 'PHP', 'PhpMyAdmin', 'MySQL', 'Bootstrap', 'JavaScript'],
    year: '2024',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80',
      'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&q=80',
    ],
    overview:
      'SehatYuk dikembangkan untuk menjembatani kendala antrean panjang di fasilitas kesehatan primer melalui digitalisasi sistem antrean poliklinik dan riwayat pengobatan pasien berbasis web.',
    background:
      'Banyak fasilitas kesehatan masih mengandalkan pencatatan rekam medis fisik di kartu map, rentan tercecer, dan pasien harus datang pagi-pagi buta hanya untuk mengambil nomor antrean manual.',
    problemStatement:
      'Lamanya waktu tunggu pasien di ruang poliklinik serta tingginya potensi kehilangan riwayat pengobatan pasien saat berkonsultasi antar dokter spesialis.',
    objectives: [
      'Digitalisasi pendaftaran jadwal periksa dokter secara online',
      'Penyediaan dashboard dokter untuk mencatat diagnosa dan resep obat',
      'Manajemen database relasional rekam medis pasien di PhpMyAdmin / MySQL',
      'Implementasi hak akses peran (Pasien, Dokter, Tenaga Medis/Admin)',
    ],
    solution:
      'Membangun web application dengan framework Laravel MVC, autentikasi terproteksi middleware, dan skema database relasional ternormalisasi pada MySQL.',
    keyFeatures: [
      'Reservasi jadwal dokter dengan pilihan poliklinik dan jadwal hari',
      'Rekam medis elektronik (EHR) dengan catatan riwayat alergi dan obat',
      'Dashboard statistik kunjungan pasien untuk manajemen klinik',
      'Cetak rujukan dan bukti temu janji berformat PDF',
    ],
    developmentProcess: [
      { phase: '01. Analisis Kebutuhan Sistem', desc: 'Identifikasi alur bisnis pendaftaran klinik dan perancangan use case diagram.' },
      { phase: '02. Perancangan Database', desc: 'Pembuatan Entity Relationship Diagram (ERD) dan migrasi skema tabel di MySQL.' },
      { phase: '03. Pengembangan Laravel MVC', desc: 'Pembuatan controller, model Eloquent ORM, dan Blade views.' },
      { phase: '04. User Acceptance Testing', desc: 'Uji fungsionalitas pengujian input data pasien dan reservasi online.' },
    ],
    contributors: [
      { memberId: 1, role: 'Lead Fullstack Developer & System Analyst' },
      { memberId: 2, role: 'Backend Support' },
      { memberId: 4, role: 'UI/UX Evaluator' },
    ],
    results:
      'Berhasil mendigitalisasi alur pendaftaran klinik dengan estimasi penghematan waktu tunggu pasien hingga 45 menit per kunjungan.',
    repoUrl: 'https://github.com/PanjulAja',
    demoUrl: null,
  },

  // ── 2. Joki-In & Joki-Store (LinkedIn & GitHub: joki_in, joki_store) ──
  {
    id: 2,
    slug: 'joki-in-store-platform',
    title: 'Joki-In & Joki-Store Web Platform',
    type: 'Team',
    shortDesc: 'Platform ekosistem ganda untuk jasa joki game profesional dan marketplace voucher/item game otomatis.',
    description:
      'Platform web terhubung yang terdiri dari dua modul: Joki-In (marketplace penugasan joki game kompetitif) dan Joki-Store (toko online top-up diamond dan produk game dengan integrasi API supplier VIP-Reseller).',
    category: 'Web App',
    tags: ['Web', 'Gaming', 'E-Commerce', 'Laravel', 'API Integration'],
    tech: ['Laravel', 'Blade', 'PHP', 'API Integration (VIP-Reseller)', 'MySQL', 'Bootstrap'],
    year: '2024',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80',
    ],
    overview:
      'Proyek platform ganda yang dibangun untuk menyediakan transaksi jasa joki game yang aman dengan sistem escrow/rekber otomatis, sekaligus toko voucher game yang memproses order 24 jam nonstop via API.',
    background:
      'Transaksi jasa joki di media sosial sering diwarnai penipuan, akun di-hack, serta proses top-up yang memakan waktu lama karena verifikasi manual admin.',
    problemStatement:
      'Rawannya transaksi peer-to-peer tanpa pihak ketiga tepercaya dalam industri joki game, serta kebutuhan automasi fulfillment pesanan top-up game instan.',
    objectives: [
      'Membangun sistem penugasan order joki dengan status tracking real-time',
      'Integrasi API pihak ketiga (VIP-Reseller) untuk automasi pengiriman item',
      'Sistem dompet saldo dan konfirmasi pembayaran otomatis',
      'Pemisahan modul arsitektur: joki_in dan joki_store',
    ],
    solution:
      'Backend Laravel terstruktur dengan antrian asynchronous untuk webhook API supplier, serta proteksi keamanan credential akun pemain saat proses pengerjaan joki.',
    keyFeatures: [
      'Katalog game populer (Mobile Legends, Valorant, Free Fire, Genshin Impact)',
      'Automated API fulfillment untuk top-up produk digital secara instan',
      'Dashboard perjoki untuk mengambil tiket order dan mengunggah bukti pengerjaan',
      'Tracking progress rank/level langsung dari akun pemesan',
    ],
    developmentProcess: [
      { phase: '01. Arsitektur Multi-Modul', desc: 'Pemisahan repositori backend dan repositori store (joki_in & joki_store).' },
      { phase: '02. Integrasi Endpoint Supplier', desc: 'Konsumsi REST API VIP-Reseller untuk pengecekan saldo, order, dan status.' },
      { phase: '03. Slicing Antarmuka Gamer', desc: 'Pembuatan tema dark-mode dengan Blade template responsif.' },
      { phase: '04. Testing Transaksi', desc: 'Pengujian siklus checkout sandbox dan penanganan timeout transaksi.' },
    ],
    contributors: [
      { memberId: 1, role: 'Backend Lead & Third-Party API Integrator' },
      { memberId: 2, role: 'Database & Frontend Support' },
      { memberId: 5, role: 'Security & Order Flow Testing' },
    ],
    results:
      'Berhasil mengotomatisasi 100% proses transaksi voucher game tanpa intervensi admin manual dengan response time API di bawah 3 detik.',
    repoUrl: 'https://github.com/PanjulAja',
    demoUrl: null,
  },

  // ── 3. SIMA Tel-U (LinkedIn) ──
  {
    id: 3,
    slug: 'sima-telu-internship-alumni',
    title: 'SIMA Tel-U — Sistem Informasi Magang & Alumni',
    type: 'Team',
    shortDesc: 'Platform portal akademik Telkom University untuk manajemen lowongan magang, pelaporan logbook, dan jejaring alumni.',
    description:
      'SIMA Tel-U (Sistem Informasi Magang & Alumni) adalah platform berbasis web resmi yang memfasilitasi mahasiswa Telkom University dalam mencari lowongan magang mitra, mencatat logbook mingguan magang, serta menjaga relasi sinergis dengan para alumni.',
    category: 'Web App',
    tags: ['Web', 'Academic', 'Laravel', 'Telkom University'],
    tech: ['Laravel', 'PHP', 'HTML5', 'Bootstrap', 'MySQL', 'JavaScript'],
    year: '2024',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80',
    ],
    overview:
      'Portal terpadu kemahasiswaan kampus Telkom University untuk memusatkan informasi program kerja magang industri (MBKM / Kerja Praktik) dan membangun database tracer study alumni.',
    background:
      'Sebelumnya informasi lowongan kerja magang dan bimbingan laporan tersebar di email jurusan dan file dokumen lokal sehingga menyulitkan monitoring dosen pembimbing.',
    problemStatement:
      'Kesulitan dalam memonitor kehadiran logbook mahasiswa magang secara real-time dan terputusnya jejaring karir antara mahasiswa tingkat akhir dengan alumni kampus.',
    objectives: [
      'Menyediakan portal terpusat lowongan magang terverifikasi mitra Tel-U',
      'Memfasilitasi pengisian logbook harian/mingguan yang disetujui dosen pembimbing',
      'Tracer study alumni dan forum berbagi pengalaman industri',
      'Automasi cetak surat pengantar magang dari universitas',
    ],
    solution:
      'Mengembangkan aplikasi web Laravel dengan role-based access control (Mahasiswa, Dosen Pembimbing, Mitra Perusahaan, dan Admin Alumni).',
    keyFeatures: [
      'Portal kurasi lowongan magang dengan filter industri dan lokasi',
      'Sistem logbook digital dengan fitur upload foto aktivitas dan approval dosen',
      'Direktori alumni terverifikasi dengan fitur mentoring karir',
      'Generasi dokumen evaluasi penilaian magang otomatis',
    ],
    developmentProcess: [
      { phase: '01. Stakeholder Interview', desc: 'Wawancara dengan koordinator magang prodi dan perwakilan alumni.' },
      { phase: '02. Arsitektur Data Tel-U', desc: 'Pemetaan skema data mahasiswa, dosen NIDN, dan status kemitraan.' },
      { phase: '03. Implementasi Laravel', desc: 'Pembuatan modul autentikasi SSO kampus dan modul approval logbook.' },
      { phase: '04. Pengujian Sistem', desc: 'Uji verifikasi workflow persetujuan logbook magang.' },
    ],
    contributors: [
      { memberId: 1, role: 'Backend Lead & Database Architect' },
      { memberId: 3, role: 'API Consultant' },
      { memberId: 4, role: 'UI Wireframe & User Flow' },
    ],
    results:
      'Diujicobakan pada program magang fakultas dengan 100+ mahasiswa terdaftar dan proses approval logbook terpangkas dari 3 hari menjadi hitungan menit.',
    repoUrl: 'https://github.com/PanjulAja',
    demoUrl: null,
  },

  // ── 4. SiCepat Mobile App UI/UX Redesign (LinkedIn) ──
  {
    id: 4,
    slug: 'sicepat-mobile-redesign',
    title: 'SiCepat Mobile App UI/UX Redesign (Figma Prototype)',
    type: 'Personal',
    shortDesc: 'Studi kasus komprehensif redesain antarmuka mobile SiCepat Ekspres dengan Figma Interactive Prototype.',
    description:
      'Proyek riset dan redesain antarmuka menyeluruh untuk aplikasi mobile SiCepat Ekspres. Berfokus pada perbaikan hierarki visual tracking resi, alur request pickup kurir yang intuitif, serta modernisasi brand identity dengan design system berbasis Figma.',
    category: 'Design',
    tags: ['Personal', 'UI/UX Design', 'Figma', 'Prototyping', 'Case Study'],
    tech: ['Figma', 'FigJam', 'User Research', 'Design System', 'Usability Testing'],
    year: '2025',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&q=80',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&q=80',
    ],
    overview:
      'Karya desain produk digital komprehensif yang membedah kelemahan antarmuka eksisting aplikasi SiCepat dan menyajikan solusi desain yang memprioritaskan kemudahan pengguna.',
    background:
      'Pengguna aplikasi kurir ekspres mayoritas menginginkan akses instan ke nomor resi paket mereka dalam 1 ketukan layar, namun aplikasi lama dipenuhi banner promosi yang mendominasi.',
    problemStatement:
      'Pengguna mengalami cognitive overload karena layout berdesakan dan kesulitan melacak posisi armada kurir saat estimasi waktu antar paket dibutuhkan secara darurat.',
    objectives: [
      'Menyederhanakan alur cek ongkir dan lacak resi dari 4 langkah menjadi 1 langkah di beranda',
      'Merancang live courier delivery map tracking yang informatif',
      'Menyusun design system Figma auto-layout lengkap dengan komponen varian dan tokens',
      'Membuat prototipe interaktif dengan micro-interactions',
    ],
    solution:
      'Redesain antarmuka mobile berfokus pada card-based UI clean, tipografi berkarakter, penempatan tracking pill di area jangkauan jempol (thumb-zone), dan prototipe Figma beranimasi tinggi.',
    keyFeatures: [
      'Instant Tracking Bar di area header beranda',
      'Live Courier Map Tracker dengan visual rute dan estimasi tiba',
      'Kalkulator ongkos kirim pintar dengan deteksi kode pos otomatis',
      'Fitur drop point locator terdekat dengan integrasi maps',
    ],
    developmentProcess: [
      { phase: '01. Empathize & Audit Heuristik', desc: 'Menganalisis rating ulasan pengguna di Play Store dan membedah 10 prinsip Nielsen.' },
      { phase: '02. Information Architecture', desc: 'Merombak arsitektur navigasi bottom navigation bar menjadi 4 menu esensial.' },
      { phase: '03. Hi-Fi UI Design System', desc: 'Pembuatan master components, varian button, input field, dan color palette di Figma.' },
      { phase: '04. Interactive Prototyping', desc: 'Penyusunan smart animation interaktif dari alur cek resi hingga bukti serah terima.' },
    ],
    contributors: [
      { memberId: 1, role: 'Lead UI/UX Product Designer & Researcher' },
    ],
    results:
      'Prototipe diuji pada 15 responden dengan tingkat penyelesaian tugas (Task Completion Rate) mencapai 93.3% dan feedback visual positif.',
    repoUrl: null,
    demoUrl: 'https://www.linkedin.com/in/zulfa-yafiansyah-9b4604218/',
  },

  // ── 5. UTS Data Buku (GitHub: UTS_Zulfa-Yafiansyah_Kelompok-2-Data-Buku) ──
  {
    id: 5,
    slug: 'uts-data-buku-mobile',
    title: 'UTS Data Buku — Kelompok 2 (PAB)',
    type: 'Team',
    shortDesc: 'Aplikasi mobile Android native Kotlin untuk pengelolaan katalog dan sirkulasi data buku perpustakaan.',
    description:
      'Aplikasi Android yang dibangun untuk pemenuhan Ujian Tengah Semester (UTS) mata kuliah Pengembangan Aplikasi Bergerak (PAB) Telkom University Kelompok 2. Berfokus pada pengelolaan CRUD data buku, antarmuka Material Design, dan database lokal SQLite.',
    category: 'Mobile App',
    tags: ['Android', 'Kotlin', 'PAB', 'Telkom University'],
    tech: ['Kotlin', 'Android Studio', 'Gradle (kts)', 'SQLite', 'Material Design', 'ViewBinding'],
    year: '2024',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80',
    ],
    overview:
      'Aplikasi mobile Android native berbasis Kotlin yang memfasilitasi pencatatan data buku, pemilahan kategori literatur, pencarian judul cepat, dan pemantauan ketersediaan stok buku tanpa internet.',
    background:
      'Pencatatan sirkulasi buku pada komunitas baca seringkali masih dilakukan di buku manual yang rentan rusak dan tidak praktis saat pengecekan ketersediaan buku.',
    problemStatement:
      'Dibutuhkan aplikasi mobile Android offline-first yang ringan, memiliki form validasi ketat, serta performa rendering list data yang mulus.',
    objectives: [
      'Membangun aplikasi mobile native dengan bahasa Kotlin di Android Studio',
      'Implementasi operasi CRUD lengkap (Create, Read, Update, Delete) data buku',
      'Menyediakan antarmuka Material Design dengan RecyclerView responsif',
      'Menerapkan arsitektur kode terstruktur berbasis Gradle kts',
    ],
    solution:
      'Mengembangkan aplikasi menggunakan Kotlin dengan ViewBinding, SQLite database helper untuk persistensi offline, dan custom RecyclerView adapter dengan ViewHolder pattern.',
    keyFeatures: [
      'Katalog data buku interaktif dengan cover thumbnail dan detail tahun terbit',
      'Pencarian instan berdasarkan judul buku dan nama penulis',
      'Form validasi input data ISBN, judul, penerbit, dan kategori',
      'Dialog konfirmasi penghapusan data untuk keamanan pengguna',
    ],
    developmentProcess: [
      { phase: '01. Perancangan Skema Data', desc: 'Menyusun tabel database SQLite untuk data buku dan relasi kategori.' },
      { phase: '02. Layouting XML & Material', desc: 'Merancang antarmuka aktivitas dan item list kartu buku.' },
      { phase: '03. Kotlin Activity Logic', desc: 'Pemrograman business logic, ViewBinding, dan SQLite CRUD helper.' },
      { phase: '04. Debugging & Build APK', desc: 'Pengujian pada perangkat Android fisik dan optimasi compile Gradle.' },
    ],
    contributors: [
      { memberId: 1, role: 'Lead Android Developer & UI Implementer' },
    ],
    results:
      'Aplikasi berhasil dikompilasi tanpa error, lulus pengujian fungsionalitas CRUD pada perangkat Android 11–14, dan mendapatkan nilai maksimal pada evaluasi UTS PAB.',
    repoUrl: 'https://github.com/PanjulAja/UTS_Zulfa-Yafiansyah_Kelompok-2-Data-Buku',
    demoUrl: null,
  },

  // ── 6. ERWE (GitHub: ERWE) ──
  {
    id: 6,
    slug: 'erwe-community-platform',
    title: 'ERWE — Community & Neighborhood Management Web App',
    type: 'Personal',
    shortDesc: 'Aplikasi web manajemen warga RT/RW modern untuk iuran kas warga, administrasi surat pengantar, dan pengumuman publik.',
    description:
      'Aplikasi web manajemen komunitas rukun tetangga (RT/RW) berbasis TypeScript. Diciptakan untuk memodernisasi tata kelola administrasi warga, transparansi laporan kas keuangan, dan permohonan surat pengantar domisili secara digital.',
    category: 'Web App',
    tags: ['Personal', 'TypeScript', 'Community', 'Web Platform'],
    tech: ['TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'HTML5', 'CSS Architecture'],
    year: '2024',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    ],
    overview:
      'Inisiatif digitalisasi lingkungan perumahan warga yang mengubah proses manual door-to-door dalam penarikan iuran sampah & keamanan menjadi pencatatan terpusat yang transparan.',
    background:
      'Banyak pengurus RT kesulitan membuat rekapitulasi iuran bulanan dan warga seringkali kerepotan jika membutuhkan surat pengantar kelurahan di luar jam kerja pengurus.',
    problemStatement:
      'Ketidakterbukaan alur kas lingkungan memicu kecurigaan antar warga, serta lambatnya pengurusan dokumen kependudukan tingkat RT/RW.',
    objectives: [
      'Transparansi pembukuan kas pemasukan dan pengeluaran warga secara real-time',
      'Penyediaan portal pengajuan surat pengantar online dengan template otomatis',
      'Papan buletin digital untuk pengumuman kegiatan ronda dan kerja bakti',
      'Penerapan type safety menyeluruh menggunakan TypeScript',
    ],
    solution:
      'Mengembangkan web app fullstack dengan TypeScript untuk menjamin konsistensi tipe data, didukung database PostgreSQL untuk integritas transaksi pencatatan kas.',
    keyFeatures: [
      'Dashboard transparansi kas RT dengan grafik arus kas bulanan',
      'Generator surat pengantar kelurahan ber-QR Code verifikasi',
      'Data sensus warga (Kepala Keluarga, Anggota Keluarga, status domisili)',
      'Notifikasi pengingat iuran bulanan otomatis',
    ],
    developmentProcess: [
      { phase: '01. Analisis Alur RT/RW', desc: 'Pemetaan birokrasi pengurusan berkas administrasi tingkat rukun tetangga.' },
      { phase: '02. Type-Safe Backend', desc: 'Penyusunan arsitektur REST API dengan Express dan TypeScript strict mode.' },
      { phase: '03. Frontend & Dashboard', desc: 'Pembuatan dashboard administrasi yang ramah pengguna awam.' },
      { phase: '04. Verifikasi Keamanan', desc: 'Pemberian otentikasi sesi dan proteksi data kependudukan warga.' },
    ],
    contributors: [
      { memberId: 1, role: 'Fullstack TypeScript Engineer' },
    ],
    results:
      'Membuktikan implementasi arsitektur type-safe tanpa runtime error dan efisiensi waktu penerbitan surat pengantar warga hingga 80%.',
    repoUrl: 'https://github.com/PanjulAja/ERWE',
    demoUrl: null,
  },

  // ── 7. Prak Vue W2 (GitHub: Prak_Vue_W2) ──
  {
    id: 7,
    slug: 'prak-vue-w2-lanjut',
    title: 'Prak Vue W2 — Arsitektur SPA & Pinia',
    type: 'Personal',
    shortDesc: 'Implementasi praktikum arsitektur Single Page Application Vue 3, state store terpusat Pinia, dan Vite.',
    description:
      'Repositori praktikum mata kuliah Pengembangan UI Lanjut oleh Zulfa Yafiansyah. Berisi implementasi komponen antarmuka modular, composable functions, state store terpusat Pinia, dan integrasi Vue Router berbasis standar industri.',
    category: 'Web App',
    tags: ['Personal', 'Vue 3', 'Pinia', 'Vite', 'UI Lanjut'],
    tech: ['Vue.js', 'Vite', 'Pinia', 'Vue Router', 'JavaScript', 'Prettier'],
    year: '2024',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
    ],
    overview:
      'Proyek praktikum berkala untuk memperdalam pemahaman konsep reaktivitas Vue 3 (ref, reactive, computed, watchEffect), siklus hidup komponen, serta manajemen state global.',
    background:
      'Perpindahan paradigma dari Options API ke Composition API pada Vue 3 membutuhkan pemahaman arsitektur baru agar kode tetap rapi, modular, dan terstruktur.',
    problemStatement:
      'Mengelola state aplikasi yang kompleks antar halaman yang berbeda tanpa arsitektur state management yang bersih sering memicu inkonsistensi data tampilan.',
    objectives: [
      'Menguasai setup lingkungan modern dengan Vite dan Vue DevTools',
      'Menerapkan Pinia store untuk manajemen state dinamis terpusat',
      'Membuat komponen antarmuka yang reusable dengan props dan emits',
    ],
    solution:
      'Menyusun struktur folder berbasis feature (views, components, layouts, composables) serta menggunakan Pinia actions untuk mutasi state yang terprediksi.',
    keyFeatures: [
      'Routing dinamis dengan lazy-loaded view chunks',
      'Pinia global store dengan getters dan asynchronous actions',
      'Composable pattern untuk logika yang dapat dipakai ulang',
      'Code formatting otomatis menggunakan Prettier',
    ],
    developmentProcess: [
      { phase: '01. Inisialisasi Vite', desc: 'Konfigurasi Vue 3, Vite Dev Server, dan path aliases.' },
      { phase: '02. Komponen & Layout', desc: 'Pembuatan wrapper layout dan komponen interaktif.' },
      { phase: '03. Pinia State Setup', desc: 'Penerapan state store untuk sinkronisasi data antar view.' },
    ],
    contributors: [
      { memberId: 1, role: 'Solo Frontend Developer' },
    ],
    results:
      'Menjadi fondasi teknis arsitektur modular yang kemudian dikembangkan lebih lanjut untuk pemenuhan tugas besar portofolio tim.',
    repoUrl: 'https://github.com/PanjulAja/Prak_Vue_W2',
    demoUrl: null,
  },

  // ── 8. UAS Kelompok 3 Portfolio (Proyek Saat Ini) ──
  {
    id: 8,
    slug: 'uas-kelompok-3-portfolio',
    title: 'UAS Kelompok 3 — Team Portfolio Website',
    type: 'Team',
    shortDesc: 'Website portofolio tim modern berstandar studio digital dengan dual-mode, filter multi-anggota, dan live GitHub API.',
    description:
      'Proyek utama Tugas Besar mata kuliah Pengembangan UI Lanjut. Dibangun dari nol menggunakan Vue 3 Composition API, Vite, vanilla CSS architecture dengan custom properties, dual mode (Light & Dark), integrasi live GitHub REST API v3, serta unit testing otomatis.',
    category: 'Web App',
    tags: ['Web', 'Design System', 'Vue 3', 'API Integration'],
    tech: ['Vue.js', 'Vite', 'Vue Router', 'CSS Architecture', 'GitHub API'],
    year: '2024',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80',
      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1200&q=80',
    ],
    overview:
      'Platform showcase portofolio tim dan individual mahasiswa yang mengusung konsep Editorial Creative Developer Portfolio. Menghindari template generik demi membangun identitas visual autentik dan pengalaman interaktif yang intuitif.',
    background:
      'Sebagian besar website portofolio tugas kuliah mahasiswa terlihat seragam karena mengandalkan template boilerplate pihak ketiga tanpa sentuhan desain yang matang.',
    problemStatement:
      'Ketiadaan sistem portofolio kolaboratif yang mampu mengagregasi karya seluruh anggota tim secara adil sekaligus menyediakan ruang portofolio mandiri dengan arsitektur data Many-to-Many.',
    objectives: [
      'Membangun sistem showcase dengan filter multi-kriteria: Anggota, Kategori, Teknologi, dan Live Search',
      'Menyediakan halaman profil dan portofolio mandiri untuk setiap anggota tim',
      'Mengintegrasikan live data dari GitHub REST API v3 dengan penanganan state lengkap',
      'Menerapkan pengujian unit & integrasi otomatis (Pass 100%)',
    ],
    solution:
      'Merancang arsitektur Vue 3 modular dengan reusable components, custom composables (useProjects, useGithubApi, useToast, useTheme), dan styling CSS variables independen.',
    keyFeatures: [
      'Dual-mode switcher (Light/Dark) dengan transisi mulus dan sinkronisasi localStorage',
      'Filter proyek real-time berdasarkan anggota, kategori, dan teknologi',
      'Live GitHub User & Repository explorer dengan caching dan skeleton loader',
      'Modal Lightbox galeri gambar interaktif dengan navigasi keyboard',
      'Formulir kontak dengan validasi reaktif dan sistem toast notification',
    ],
    developmentProcess: [
      { phase: '01. Konseptualisasi & Design Tokens', desc: 'Menentukan tipografi Syne & Inter, modular scale, dan palet warna dual-mode.' },
      { phase: '02. Arsitektur Komponen Reusable', desc: 'Penyusunan Button, Badge, Modal, ProjectCard, ProfileCard, dan Breadcrumbs.' },
      { phase: '03. Integrasi GitHub REST API', desc: 'Pembuatan composable async fetch dengan penanganan error 404 dan rate limit.' },
      { phase: '04. Unit Testing & Validasi', desc: 'Penulisan test runner native node:test untuk validasi 15 skenario pengujian.' },
    ],
    contributors: [
      { memberId: 1, role: 'Lead Frontend Architect & UI Designer' },
      { memberId: 2, role: 'Fullstack Integrator' },
      { memberId: 3, role: 'Backend & DevOps Consultant' },
      { memberId: 4, role: 'UX Reviewer & Copywriter' },
      { memberId: 5, role: 'QA & Testing Specialist' },
    ],
    results:
      'Aplikasi lulus 100% dari 15 test suite otomatis, build production bersih dalam waktu < 400ms, serta performa rendering optimal.',
    repoUrl: 'https://github.com/elfarizidan/UAS-Kelompok-3',
    demoUrl: null,
  },
]

export const projects = initialProjects

export const projectCategories = ['All', 'Web App', 'Mobile App', 'Design', 'Backend / API']

/**
 * Mencari proyek berdasarkan slug unik
 */
export function getProjectBySlug(slug) {
  return initialProjects.find((p) => p.slug === slug) || null
}

/**
 * Filter proyek berdasarkan kategori
 */
export function getProjectsByCategory(category) {
  if (!category || category === 'All') return initialProjects
  return initialProjects.filter((p) => p.category === category)
}

/**
 * Mendapatkan seluruh proyek yang dikerjakan oleh anggota tertentu
 */
export function getProjectsByMember(memberId) {
  const id = Number(memberId)
  return initialProjects.filter((p) => p.contributors.some((c) => c.memberId === id))
}

/**
 * Mengambil informasi anggota tim lengkap berdasarkan daftar kontributor pada suatu proyek
 */
export function getMembersByProject(project) {
  if (!project || !project.contributors) return []
  return project.contributors.map((contrib) => {
    const member = teamMembers.find((m) => m.id === contrib.memberId)
    return {
      ...contrib,
      member: member || {
        id: contrib.memberId,
        name: `Anggota ${contrib.memberId}`,
        avatar: '',
        role: contrib.role,
      },
    }
  })
}

/**
 * Mendapatkan seluruh daftar teknologi unik yang pernah digunakan tim di seluruh proyek
 */
export function getAllTechnologies(customList = initialProjects) {
  const set = new Set()
  customList.forEach((p) => {
    if (Array.isArray(p.tech)) {
      p.tech.forEach((t) => set.add(t))
    }
  })
  return Array.from(set).sort()
}
