# Dokumentasi Pengujian Sistem (Testing)
## UAS Pengembangan UI Lanjut — Kelompok 3

Dokumen ini memuat laporan skenario pengujian unit & integrasi otomatis untuk memvalidasi fungsionalitas logika relasi multi-anggota, kesesuaian proyek autentik portofolio Zulfa Yafiansyah, validasi form, dan integrasi GitHub API.

---

### Cara Menjalankan Pengujian

Eksekusi perintah berikut di terminal:
```bash
npm test
```

---

### Hasil Pengujian (Test Results)

| No | Test Suite | Test Scenario / Case | Expected Result | Actual Result | Status |
|----|------------|-----------------------|-----------------|---------------|--------|
| **1** | **Multi-Member Showcase** | Memuat kumpulan proyek terkurasi nyata | `length >= 3` | 8 proyek terdaftar | **PASS** |
| **2** | **Multi-Member Showcase** | Memiliki kepemilikan proyek `Personal` dan `Team` | Ada proyek personal & kolaboratif | Terverifikasi keduanya ada | **PASS** |
| **3** | **Multi-Member Showcase** | Seluruh proyek Zulfa Yafiansyah (member 1) sinkron dengan data LinkedIn & GitHub | Memuat SehatYuk, Joki-In, SIMA Tel-U, SiCepat, UTS Data Buku, ERWE, Prak Vue | Semua proyek autentik terdaftar | **PASS** |
| **4** | **Multi-Member Showcase** | Setiap anggota tim memiliki minimal 1 proyek terkait | Tiap anggota memiliki karya | Terhubung akurat | **PASS** |
| **5** | **Multi-Member Showcase** | Kelengkapan metadata proyek (id, slug, type, problemStatement, contributors) | Semua properti wajib ada & valid | Lengkap tanpa null field | **PASS** |
| **6** | **Multi-Member Showcase** | Fungsi `getProjectBySlug` mengembalikan proyek valid atau null | Proyek ditemukan sesuai slug | Sesuai | **PASS** |
| **7** | **Multi-Member Showcase** | Fungsi `getMembersByProject` me-resolve metadata kontributor proyek | Objek kontributor memiliki data profil | Terhubung akurat | **PASS** |
| **8** | **Multi-Member Showcase** | Fungsi `getAllTechnologies` mengekstrak daftar teknologi unik (Laravel, Vue, Kotlin, Figma, dll) | Menghasilkan daftar teknologi unik | Daftar terestrak | **PASS** |
| **9** | **Multi-Member Showcase** | Opsi kategori proyek memuat `All`, `Web App`, `Mobile App`, `Design` | Array kategori lengkap | Sesuai | **PASS** |
| **10** | **Form Validation** | Validasi payload form kontak dengan data lengkap dan benar | `isValid === true`, tidak ada error | `isValid === true`, `errors: {}` | **PASS** |
| **11** | **Form Validation** | Deteksi dan penolakan input form yang kosong | `isValid === false`, memunculkan error field | Semua field error muncul | **PASS** |
| **12** | **Form Validation** | Validasi format regex email yang tidak sesuai standar RFC | `isValid === false`, pesan 'Format email tidak valid.' | Ditolak dengan pesan spesifik | **PASS** |
| **13** | **Form Validation** | Batasan minimal panjang pesan (20 karakter) | Input < 20 karakter ditolak | Ditolak dengan pesan error | **PASS** |
| **14** | **GitHub REST API** | Pengambilan data profil publik via endpoint HTTP resmi GitHub (`GET /users/{username}`) | Mengembalikan data status 200, field `login`, dan integer `public_repos` | Response valid dari GitHub API | **PASS** |
| **15** | **GitHub REST API** | Penanganan kegagalan request saat user GitHub tidak ditemukan (404 Error handling) | Melempar error informatif dan ditangani oleh state error | Menampilkan error message terstruktur | **PASS** |

---

### Ringkasan Eksekusi:
- **Total Test Suites**: 3
- **Total Test Cases**: 15
- **Passed**: 15 (100%)
- **Failed**: 0
- **Duration**: ~136ms
