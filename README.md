# Kelompok 3 — Creative Developer Team Portfolio

> Website Portofolio Tim untuk pemenuhan Tugas Besar mata kuliah **Pengembangan UI Lanjut**.  
> Mengusung konsep **Editorial Creative Developer Portfolio** dengan tipografi berkarakter, grid asimetris yang proporsional, dual mode (Light/Dark), arsitektur modular Vue 3, dan integrasi live API GitHub.

---

## 🚀 Menjalankan Proyek

### 1. Prasyarat
- Node.js (v20+ disarankan)
- npm / pnpm

### 2. Instalasi & Menjalankan Development Server
```bash
# Instal dependensi (jika baru di-clone)
npm install

# Jalankan dev server lokal
npm run dev
```
Buka browser di `http://localhost:5173/`

### 3. Menjalankan Unit & Integration Test
```bash
npm test
```

### 4. Build untuk Production
```bash
npm run build
```

---

## 🎨 Konsep & Arah Desain (Design Direction)

- **Art Direction**: Terinspirasi dari digital studio kreatif (*Editorial Developer Portfolio*), memprioritaskan tipografi sans-serif modular (`Syne` untuk display heading, `Inter` untuk body copy teks).
- **Dual Mode**: Sistem tema Light & Dark yang terintegrasi secara dinamis via CSS Variables (`[data-theme="light"]` / `[data-theme="dark"]`) dan tersimpan di `localStorage`.
- **Asymmetric & Editorial Grid**: Variasi komposisi antar-section untuk menghindari kesan template generik.
- **Komponen Reusable**: Modularitas tinggi pada `Button`, `Badge`, `Modal`, `Breadcrumbs`, `LoadingSpinner`, `EmptyState`, `ToastContainer`, `ProjectCard`, `ProfileCard`, dan `GitLiveCard`.

---

## 📁 Struktur Halaman & Fitur Utama

1. **Home / Landing Page (`/`)**:
   - Hero section dengan tipografi berkarakter dan copywriting autentik.
   - Live statistic counter tim.
   - Discipline ticker marquee.
   - Asymmetric Featured Projects layout dengan kartu utama dan kartu sekunder.
   - Call to action menuju proyek dan kontak.

2. **About Team (`/about`)**:
   - Profil lengkap 5 anggota tim (Nama, NIM, Role, Deskripsi, Keahlian teknis, GitHub, LinkedIn).
   - Filter interaktif berdasarkan tech skill masing-masing anggota.
   - Dokumentasi cara kerja kolaboratif tim (*Our Approach*).

3. **Project Showcase (`/projects`)**:
   - Dokumentasi proyek nyata anggota tim.
   - Live Search (pencarian instan berdasarkan judul, teknologi, dan deskripsi).
   - Filter kategori (All, Web App, Mobile App, Design).
   - Sorting order (Newest first, Oldest first, Alphabetical A→Z).
   - Dynamic Empty State handling saat pencarian tidak ditemukan.

4. **Project Detail (`/projects/:slug`)**:
   - Deep-dive dokumentasi proyek: Overview, Background/Permasalahan, Objectives, Solution, Key Features, Gallery dengan interactive Lightbox modal, kontribusi anggota tim, dan hasil/dampak nyata.
   - Breadcrumbs navigation.

5. **GitHub API Explorer (`/api-explorer`)**:
   - Integrasi nyata HTTP request ke **GitHub REST API v3**.
   - Menampilkan profil live anggota tim beserta repository publik terkini.
   - Fitur pencarian profil GitHub user mana pun secara real-time.
   - Lengkap dengan Loading state (spinner & skeleton), Error handling (404/rate limit), dan Empty state.

6. **Contact (`/contact`)**:
   - Form kontak dengan validasi reaktif (nama, email RFC regex, subject, minimal panjang pesan 20 karakter).
   - Feedback submission via Toast Notification dan tampilan state konfirmasi.

---

## 🧪 Dokumentasi Pengujian
Laporan pengujian lengkap dapat diakses pada [docs/TESTING.md](file:///c:/Users/Zulfa%20Yafiansyah/Documents/Kuliah/Semester%207/Pengembangan%20UI%20Lanjut/Tugas%20Besar/UAS-Kelompok-3/docs/TESTING.md).
