# Gambar Website

Semua file di folder ini ikut ter-deploy dan bisa diakses dari path `/images/...`.

## Struktur

```
public/images/
  members/    foto anggota   -> isi field "avatar"
  projects/   dokumentasi proyek -> isi field "gallery"
```

## Cara pakai

1. Taruh file gambar di folder yang sesuai, misalnya `public/images/members/zidan.jpg`.
2. Isi path-nya (tanpa `public`) di MockAPI atau lewat tombol **Edit Data** di footer:
   - Anggota: `"avatar": "/images/members/zidan.jpg"`
   - Proyek: `"gallery": ["/images/projects/kopi-1.jpg", "/images/projects/kopi-2.jpg"]`
3. Gambar baru harus di-commit dan di-deploy ulang supaya muncul di website online.

## Tips

- Nama file huruf kecil, tanpa spasi (pakai `-`), contoh `portal-ramadhan-1.jpg`.
- Path peka huruf besar/kecil. `Zidan.JPG` dan `zidan.jpg` dianggap file berbeda.
- Foto anggota: rasio potret 4:5, sekitar 800x1000 px.
- Dokumentasi proyek: rasio 16:10, sekitar 1600x1000 px.
- Kompres gambar (JPG/WebP, di bawah ~300 KB) supaya website tetap cepat.
- Kalau path salah, website menampilkan inisial (anggota) atau placeholder (proyek), tidak error.
