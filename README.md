# Bookshelf API
Sebuah aplikasi web service sederhana yang dapat melakukan operasi CRUD (Cread, Read, Update, dan Delete) pada sebuah daftar buku yang mana menggunakan `Map` sebagai wadah menyimpannya dari pada `Array`. Dibuat untuk memenuhi tugas submission dicoding kelas `Belajar Membuat Aplikasi Back-End untuk Pemula`.

## Tech
- @hapi/hapi (^20.2.2)
- uuid (^8.3.2)

## Routes
Daftar routes ini didefinisikan pada file `src/routes.js`

### Membuat Buku
POST /books 

### Menampilkan Semua Buku 
GET /books

### Menampilkan Buku dengan Keyword Nama
GET /books?name=foo

### Menampilkan Buku yang Sedang di Baca 
GET /books?reading=1

### Menampilkan Buku yang Selesai di Baca
GET /books?finished=1

### Menampilkan Detail Buku berdasarkan ID Buku
GET /books/{id}

### Update Detail Buku berdasarkan ID Buku
PUT /books/{id}

### Hapus Buku berdasarkan ID Buku
DELETE /books/{id}


