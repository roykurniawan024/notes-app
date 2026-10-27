# Submission: Integrasi Notes App dengan RESTful API (Bintang 5 Ready)

Proyek ini dibangun untuk memenuhi seluruh **Kriteria Wajib (1–5)** dan seluruh **Kriteria Opsional (1–4)** pada kelas **Belajar Fundamental Front-End Web Development** di Dicoding Academy.

---

## 🌟 Pemenuhan Kriteria Penilaian

### Kriteria Wajib
1. **Kriteria Wajib 1 (Mempertahankan Kriteria Sebelumnya)**:
   - Menggunakan metode layouting modern **CSS Grid** (`repeat(auto-fill, minmax(280px, 1fr))`) pada `.notes-grid`, `.workspace-grid`, dan `.stats-grid`.
   - Mengimplementasikan **Web Component (Custom Elements)** yang reusable: `<app-bar>`, `<note-stats>`, `<note-input>`, `<note-item>`, `<loading-indicator>`, dan `<app-footer>`.
   - Menerapkan **Realtime Form Validation** pada input judul (wajib diisi, min. 3 karakter, maks. 50 karakter dengan penghitung karakter tersisa) dan textarea isi catatan (wajib diisi, min. 10 karakter).
   - Menerapkan `observedAttributes` dan `attributeChangedCallback` pada Custom Element.
   - Responsif pada tampilan Desktop, Tablet, dan Mobile (Media Queries `1024px`, `768px`, `480px`).
   - Fitur Dark Mode dengan persistensi tema di `localStorage`.

2. **Kriteria Wajib 2 (Memanfaatkan RESTful API sebagai Sumber Data)**:
   - Terintegrasi penuh dengan **[Dicoding Notes API v2](https://notes-api.dicoding.dev/v2)** tanpa lagi menggunakan data lokal dumi.
   - Mengambil dan menampilkan catatan aktif via `GET /notes`.
   - Menambahkan catatan baru via `POST /notes`.
   - Menghapus catatan secara permanen via `DELETE /notes/{id}`.

3. **Kriteria Wajib 3 (Menggunakan Webpack sebagai Module Bundler)**:
   - Konfigurasi Webpack modular terbagi menjadi `webpack.common.js`, `webpack.dev.js`, dan `webpack.prod.js` menggunakan `webpack-merge`.
   - Menerapkan `html-webpack-plugin` untuk otomatisasi injeksi bundle ke dalam `index.html`.
   - Perintah `npm run start-dev` menjalankan `webpack serve` dengan fitur `webpack-dev-server`, live-reload, dan port 8080.
   - Perintah `npm run build` menghasilkan bundle produksi yang teroptimasi di folder `dist/`.

4. **Kriteria Wajib 4 (Menggunakan Fetch API)**:
   - Seluruh interaksi jaringan dengan REST API memanfaatkan `fetch()` dengan sintaks modern `async/await` di dalam modul `src/scripts/data/api.js`.

5. **Kriteria Wajib 5 (Memiliki Indikator Loading)**:
   - Menggunakan Custom Element khusus `<loading-indicator>` yang memiliki spinner animasi berlapis (*multi-ring spinner*) dan pesan dinamis.
   - Indikator otomatis aktif saat request HTTP dikirim dan tertutup setelah respon diterima.

---

### Kriteria Opsional (Target Nilai Bintang 5)
1. **Kriteria Opsional 1 (Fitur Arsip Catatan)**:
   - Menampilkan catatan yang diarsipkan via `GET /notes/archived`.
   - Mengarsipkan catatan aktif via `POST /notes/{id}/archive`.
   - Mengembalikan catatan arsip ke status aktif via `POST /notes/{id}/unarchive`.
   - Filter tab real-time: **Semua**, **Aktif**, dan **Arsip**.

2. **Kriteria Opsional 2 (Menampilkan Feedback Saat Terjadi Error)**:
   - Menyediakan modul notifikasi `FeedbackHelper` yang menampilkan pesan *toast notification* yang informatif saat terjadi error koneksi, gagal simpan, gagal arsip, maupun gagal hapus.

3. **Kriteria Opsional 3 (Efek Pergerakan Halus & Animasi)**:
   - Animasi kartu masuk (*card entrance/fade-in scale*).
   - Animasi putaran halus *loading spinner* (`spinRing`).
   - Animasi pop-up pada modal konfirmasi hapus dan transisi *backdrop blur*.

4. **Kriteria Opsional 4 (Menerapkan Prettier sebagai Code Formatter)**:
   - Package `prettier` terdaftar dalam `devDependencies` di `package.json`.
   - Berkas konfigurasi `.prettierrc` tersedia di root proyek.
   - Script `npm run format` tersedia untuk merapikan seluruh berkas kode.

---

## 📁 Struktur Direktori Proyek

```
notes-app/
├── index.html
├── package.json
├── .prettierrc
├── README.md
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
└── src/
    ├── index.js
    ├── styles/
    │   └── style.css
    └── scripts/
        ├── main.js
        ├── data/
        │   └── api.js
        ├── utils/
        │   └── feedback.js
        └── components/
            ├── app-bar.js
            ├── note-stats.js
            ├── note-input.js
            ├── note-item.js
            ├── loading-indicator.js
            └── app-footer.js
```

---

## 🚀 Panduan Menjalankan Proyek

### 1. Memasang Dependensi
Pastikan Node.js telah terpasang di komputer Anda, lalu jalankan:
```bash
npm install
```

### 2. Menjalankan Server Development
Untuk menjalankan aplikasi pada mode pengembangan:
```bash
npm run start-dev
```
Aplikasi otomatis terbuka di browser pada alamat `http://localhost:8080`.

### 3. Membangun Berkas Produksi
Untuk melakukan build akhir:
```bash
npm run build
```
Hasil build akan dihasilkan pada direktori `dist/`.

### 4. Menjalankan Code Formatter Prettier
Untuk merapikan format kode sesuai `.prettierrc`:
```bash
npm run format
```
