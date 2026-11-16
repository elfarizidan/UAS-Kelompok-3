# Arsitektur Sistem Portofolio Multi-Anggota (Multi-Member Portfolio)
## UAS Pengembangan UI Lanjut — Kelompok 3

### 1. Model Relasi Data (Many-to-Many Architecture)
Website portofolio ini menerapkan relasi **Many-to-Many** antara entitas **Anggota Tim (`teamMembers`)** dan entitas **Proyek (`projects`)**:
- Setiap anggota dapat memiliki banyak proyek (baik Personal Project maupun Team Collaboration).
- Setiap proyek dapat dikerjakan oleh satu anggota (*Personal Project*) atau beberapa anggota (*Team Project*).
- Setiap anggota memiliki `role` atau kontribusi spesifik pada masing-masing proyek yang diikutinya.

```
[ Anggota Tim (teamMembers) ]  <--- (1 : N) --->  [ Contributors Bridge ]  <--- (N : 1) --->  [ Proyek (projects) ]
  - id                                              - memberId                                      - id, slug
  - name, nim, role                                 - role (per-project)                            - title, type
  - skills, avatar, socials                         - isLead                                        - category, tech
                                                                                                    - problemStatement
                                                                                                    - solution, gallery
```

---

### 2. Fitur Showcase Terpusat (`/projects`)
1. **Filter Anggota (Filter by Member)**: Pengunjung dapat mengklik chip profil anggota untuk memfilter seketika hanya proyek yang dikerjakan oleh anggota tersebut.
2. **Filter Kategori (Filter by Category)**: Pemilahan tipe karya (`Web App`, `Mobile App`, `Design`, `Backend / API`).
3. **Filter Teknologi (Filter by Technology)**: Dropdown dinamis berisi seluruh daftar teknologi unik (`Vue.js`, `Flutter`, `Python`, `Node.js`, dll).
4. **Live Search**: Pencarian real-time mencakup nama proyek, deskripsi, teknologi, serta nama anggota tim pemilik proyek.
5. **Sorting Multi-Kriteria**: Berdasarkan tahun terbaru, tahun terlama, atau alfabetik (A→Z).

---

### 3. Halaman Portofolio Pribadi Anggota (`/members/:id`)
Setiap anggota memiliki dedicated page yang menampilkan:
- Kartu profil lengkap (Nama, NIM, Role, Bio, Keahlian teknis).
- Statistik keterlibatan: Total proyek, Proyek Personal, Proyek Tim.
- Tautan profesional (GitHub, LinkedIn, Email).
- **Daftar Proyek Pribadi & Tim** yang dikerjakan oleh anggota tersebut, lengkap dengan label peran spesifiknya pada proyek bersangkutan dan navigasi langsung ke halaman detail proyek.

---

### 4. Halaman Detail Proyek (`/projects/:slug`)
Menampilkan dokumentasi studi kasus mendalam:
- Overview & Background.
- **Problem Statement** (titik permasalahan nyata yang diselesaikan).
- Objectives & Solutions.
- Key Features (fitur-fitur unggulan).
- **Development Process** (fase riset, arsitektur, implementasi, dan pengujian).
- **Member Contributions**: Kartu kontributor terhubung langsung ke halaman portofolio masing-masing anggota tim.
- Technology Stack, Project Gallery (dengan modal Lightbox interaktif), Repository GitHub, dan Live Demo.

