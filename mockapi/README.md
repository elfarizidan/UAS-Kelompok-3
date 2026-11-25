# MockAPI Setup

Semua data website diambil dari [mockapi.io](https://mockapi.io) dengan **2 resource** (sesuai batas free tier):
`team` (identitas tim + daftar anggota) dan `projects`.
File JSON di folder ini adalah data awal (placeholder). Ganti isinya dengan data asli tim.

## 1. Buat project dan resource

1. Login ke mockapi.io, buat project baru. API prefix: `/api/v1`.
2. Buat 2 resource dengan nama persis:
   - `team`
   - `projects`

## 2. Isi data

Pilih salah satu cara.

**A. Lewat editor Data di MockAPI**
Buka resource, klik **Data**, tempel isi `team.json` atau `projects.json`, lalu simpan.

**B. Lewat script**
Set jumlah data awal tiap resource ke 0, lalu jalankan dari root project:

```sh
node mockapi/seed.mjs https://<project-id>.mockapi.io/api/v1
```

Jalankan sekali saja. Kalau dijalankan dua kali, data akan dobel.

## 3. Hubungkan ke website

Salin `.env.example` menjadi `.env.local`, lalu isi:

```
VITE_API_BASE_URL=https://<project-id>.mockapi.io/api/v1
```

Restart `npm run dev` setelah mengubah file env.

## Struktur data

### team (1 item)
| Field | Tipe | Keterangan |
|---|---|---|
| name, codename, tagline, summary, mission | string | Identitas tim |
| values | array `{code, title, description}` | Nilai / fokus tim |
| stats | array `{label, value}` | Angka di beranda |
| email, github, linkedin, location | string | Kontak tim |
| members | array anggota (lihat di bawah) | Profil anggota |

Field tiap anggota di `members`:
| Field | Tipe | Keterangan |
|---|---|---|
| id | string | Unik per anggota |
| name, role, agentClass, bio | string | Profil |
| skills | array string | Keahlian |
| avatar | string | Path foto, contoh `/images/members/zidan.jpg` (lihat `public/images/README.md`). Kosong = tampil inisial |
| email, github, linkedin | string | Kontak pribadi |

### projects
| Field | Tipe | Keterangan |
|---|---|---|
| title, summary, category, year | string | Info kartu |
| featured | boolean | `true` = tampil di beranda (maks 3) |
| technologies | array string | Teknologi |
| background | string | Latar belakang |
| goals, features | array string | Tujuan dan fitur |
| gallery | array string | Path gambar, contoh `/images/projects/kopi-1.jpg`. Teks biasa = tampil sebagai caption placeholder |
| contributions | array `{member, task}` | `member` = nama anggota persis seperti di `team.members` |
