# Laboratory Service & Calibration Request API

Backend RESTful API untuk mengelola layanan pengajuan kalibrasi dan pengujian perangkat laboratorium/industri. Dirancang dengan fokus pada keamanan data, otentikasi berbasis token, serta validasi input yang ketat.

## 🚀 Fitur Utama
- **User Authentication & Authorization**: Registrasi dan Login menggunakan enkripsi password (`bcryptjs`) dan JWT (JSON Web Token).
- **Data Validation & Sanitization**: Validasi input ketat dengan `express-validator` untuk memfilter input berbahaya (Mencegah SQL Injection & XSS).
- **CRUD Service Request**: Endpoint khusus terproteksi untuk pengguna mengajukan dan melihat daftar status kalibrasi alat.
- **Postman Collection Supported**: File collection pengujian API telah disertakan dalam repositori.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase / Neon.tech)
- **Security & Auth**: JWT, bcryptjs, Express-Validator, CORS
- **Testing Tool**: Postman

## 📄 Endpoint API

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | Mendaftarkan pengguna baru | No |
| `POST` | `/api/login` | Login dan mengambil JWT Token | No |
| `POST` | `/api/requests` | Membuat pengajuan kalibrasi baru | Yes (Bearer Token) |
| `GET` | `/api/requests` | Mengambil daftar pengajuan user | Yes (Bearer Token) |

## 📦 Cara Menjalankan Proyek
1. Clone repositori ini: `git clone <LINK_REPO>`
2. Install dependensi: `npm install`
3. Buat file `.env` dan sesuaikan nilainya:
   ```env
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
4. Jalankan inisialisasi tabel: `node initDb.js`
5. Jalankan server: `npm run dev`  
