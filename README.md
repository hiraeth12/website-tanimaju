# **TaniMaju**
---

<div align="center">
  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="60"/>
  &nbsp&nbsp
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="60" />
  &nbsp&nbsp
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" width="60">
  &nbsp&nbsp       
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" width="60"/>
  &nbsp&nbsp   
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" width="60"/>
  
</div>

---
## **Website Manajemen Hasil Panen Desa**
<div align ="justify">

TaniMaju is a web-based platform designed to help village communities manage and showcase the results of their agricultural harvests. Built using *React* and *Vite*, this system streamlines the process of recording, displaying, and reporting village produce, enabling transparency and ease of access for both community members and buyers.

</div>

---

## **Features**
 - Manajemen Panen: Tambah, edit, dan hapus data hasil panen desa.
 - Etalase Produk: Tampilkan hasil panen dengan gambar dan deskripsi.
 - Pelaporan: Hasilkan laporan mengenai jumlah panen dan penjualan.
 - Peran Pengguna: Dukungan untuk admin dan pengguna biasa dengan izin yang disesuaikan.
 - Desain Responsif: Dioptimalkan untuk perangkat desktop dan seluler.

---

## Usage
- Masuk atau Daftar sebagai pengguna.
- Menambah record panen di halaman dasboard.
- Create read delete update untuk panen, item , tanaman .
- Mendapatkan report dalam bentuk csv.
---


## **Tutorial Instalasi**


- Pastikan Git sudah terinstall di PC (buka cmd lalu ketikkan)
```bash
git --version
```
- Pastikan NodeJs(NPM) sudah terinstall di PC (buka cmd lalu ketik)
```bash
node -v
```

- Clone Repository ini 
```bash
git clone https://github.com/hiraeth12/website-tanimaju
```

- Pindah Folder hasil clone repo
```bash
cd website-tanimaju
```


- Jalanakan npm install 
```bash
npm install
```

- Jalankan local server vite react (frontend)
```bash
npm run dev
```

- Pindah ke folder backend 
```bash
cd backend
```

- Jalankan local server express (backend)
```bash
npm run dev
```
- Copy isi dari .env.example frontend & backend


---

## Import MySQL Schema

1. Pastikan MySQL & Apache/Nginx sudah terinstall dan berjalan.
2. Buka MySQL client (MySQL Workbench, phpMyAdmin, atau command line).
3. Import schema dari file `backend/src/database/mysql-schema.sql`:


```bash
mysql -u <your_username> -p <your_database> < backend/src/database/mysql-schema.sql
```

Atau, copy-paste isi file tersebut ke MySQL client Anda.

Ini akan membuat skema database dan tabel yang diperlukan untuk aplikasi.

---

**TaniMaju** - Empowering Villages, Connecting Communities