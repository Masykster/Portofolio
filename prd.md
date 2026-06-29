Product Requirement Document (PRD)

Website Portofolio Pribadi (Tema: Neo-Brutalisme)

1. Ringkasan Proyek (Project Overview)

1.1 Latar Belakang

Website portofolio ini berfungsi sebagai representasi digital profesional untuk menampilkan karya, keahlian, pengalaman, dan kepribadian pemiliknya. Dengan mengadopsi tema Neo-Brutalisme, website ini bertujuan untuk tampil beda, berani, modern, dan menonjol di antara portofolio standar lainnya di industri kreatif dan teknologi.

1.2 Tujuan Utama (Goals)

Kredibilitas Profesional: Menyediakan platform yang kredibel bagi calon klien atau perekrut untuk melihat hasil kerja.

Konversi Kontak: Memudahkan pengunjung untuk menghubungi pemilik portofolio secara langsung.

Performa Tinggi: Memanfaatkan kecepatan luar biasa dari Astro JS untuk menghasilkan skor Core Web Vitals yang sempurna (100% pada Performance & SEO).

Estetika Unik: Menerapkan gaya visual Neo-Brutalisme tanpa mengorbankan aksesibilitas dan kemudahan navigasi (UX).

1.3 Target Audiens

Calon Rekrutmen (HRD/Tech Recruiter)

Calon Klien (Freelance/Contract)

Sesama Developer & Desainer (Networking)

2. Arsitektur Teknologi (Tech Stack)

Komponen

Teknologi Pilihan

Alasan Pemilihan

Framework

Astro JS (v4.x+)

Sangat cepat karena berbasis Static Site Generation (SSG) secara default, minim JavaScript yang dikirim ke browser (Zero JS), dan developer experience yang luar biasa.

Styling

Tailwind CSS

Mempermudah implementasi komponen Neo-Brutalisme (seperti custom shadow, border tebal, warna saturated) menggunakan utility classes.

Iconography

Lucide Icons / React Icons

Konsisten, ringan, dan mudah diintegrasikan.

Deployment

Vercel / Netlify / GitHub Pages

Gratis, cepat, otomatis terintegrasi dengan repositori Git, serta dilengkapi CDN global.

Form Handling

Web3Forms / Formspree

Mengirim email langsung dari form statis tanpa perlu setup backend sendiri.

3. Panduan Desain (Neo-Brutalist Design System)

Gaya Neo-Brutalisme memiliki karakteristik visual yang sangat khas. Berikut adalah aturan desain yang harus diimplementasikan pada website ini:

3.1 Skema Warna (Color Palette)

Background Utama: Putih gading (#F4F4F0) atau warna pastel yang sangat pucat.

Warna Aksen (Saturated):

Kuning Terang (#FFE600)

Hijau Neon (#39FF14)

Biru Elektrik (#00E5FF)

Oranye menyala (#FF6B00)

Border & Teks: Hitam Pekat (#000000).

3.2 Elemen UI Utama

Border: Minimal 3px atau 4px solid hitam (border-4 border-black).

Shadow (Bayangan): Menggunakan bayangan tegas tanpa blur (flat/hard shadow) yang bergeser ke kanan bawah.

Tailwind helper: shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] atau shadow-[8px_8px_0px_0px_rgba(0,0,0,1)].

Card: Sudut siku-siku (tidak menggunakan rounded border besar, maksimal rounded-md atau rounded-none).

Efek Hover: Elemen bergerak berlawanan arah bayangan (misal: saat hover, bayangan mengecil atau posisi elemen bergeser ke arah bayangan untuk efek "menekan").

3.3 Tipografi

Headline / Title: Menggunakan font Sans-Serif tebal, asimetris, atau bergaya retro-komputer (contoh: Space Grotesk, Lexend Mega, atau Syne).

Body Text: Font yang sangat terbaca (contoh: Inter, Plus Jakarta Sans, atau Sora).

4. Struktur Halaman & Fitur Utama

Website ini akan dirancang sebagai Single Page Application (SPA) / Multi-Page yang efisien. Di bawah ini adalah modul-modul halaman yang dibutuhkan:

4.1 Header & Navigasi (sticky)

Logo bertema Neo-Brutalisme (bisa berupa inisial nama dengan border tebal).

Menu Navigasi: Karya, Tentang, Keahlian, Kontak.

Tombol CTA cepat: "Hubungi Saya" (dengan animasi hover tombol khas Brutalisme).

4.2 Hero Section (First Impression)

Judul besar yang menarik perhatian (misalnya: "Halo, Saya [Nama Kamu] — Pengembang Web yang Senang Membuat Hal-Hal Unik.").

Teks sub-headline singkat tentang spesialisasi.

Badge atau tag keahlian dalam bentuk pill-box ber-border tebal.

Tombol CTA utama (Lihat Portofolio) dan sekunder (Unduh CV).

4.3 Portofolio / Karya (Projects Grid)

Daftar proyek pilihan ditampilkan dalam bentuk kartu (cards) Neo-Brutalisme.

Setiap kartu proyek memuat:

Gambar/Mockup Proyek (dengan filter grayscale yang berubah menjadi berwarna saat di-hover).

Judul & Deskripsi Singkat.

Tag Teknologi yang digunakan (React, Astro, Tailwind, dll.).

Tombol tautan ke "Live Demo" dan "GitHub Repo".

4.4 Keahlian & Teknologi (Skills Section)

Menampilkan ikon teknologi yang dikuasai.

Menggunakan grid layout yang asimetris dengan latar belakang warna aksen neo-brutalis yang berbeda untuk setiap kategori teknologi.

4.5 Tentang Saya & Pengalaman (About & Timeline)

Deskripsi singkat mengenai latar belakang, filosofi kerja, dan minat di luar koding.

Riwayat kerja atau pendidikan disajikan dalam bentuk Timeline vertikal dengan garis pembatas tebal hitam dan penanda berupa kotak/lingkaran padat.

4.6 Kontak (Contact Form)

Formulir kontak sederhana (Nama, Email, Pesan).

Input field menggunakan border tebal border-3 border-black dan fokus efek latar belakang berubah warna.

Alternatif: Tautan langsung ke media sosial utama (GitHub, LinkedIn, Twitter/X) dalam bentuk tombol ikonik besar.

4.7 Footer

Teks hak cipta.

Status ketersediaan kerja saat ini (misalnya: "Tersedia untuk proyek baru 🟢").

5. Persyaratan Non-Fungsional (Non-Functional Requirements)

Performa & Optimasi Gambar: Semua gambar wajib menggunakan komponen <Image /> bawaan Astro untuk konversi otomatis ke format .webp atau .avif.

Aksesibilitas (a11y):

Rasio kontras teks dengan latar belakang harus memenuhi standar WCAG AA (sangat terbaca karena kontras tinggi Neo-Brutalisme).

Tag HTML semantik (<header>, <main>, <section>, <footer>, <article>).

Responsive Design: Tampilan wajib dioptimalkan untuk perangkat mobile (responsive grid), mengingat elemen Neo-Brutalisme cenderung memakan banyak ruang visual.

6. Rencana Pengembangan (Milestones)

Fase 1: Inisialisasi & Setup

Instalasi Astro JS, Tailwind CSS, dan integrasi Google Fonts (Space Grotesk & Inter).

Konfigurasi file Tailwind untuk custom palette (warna aksen, border-width, custom shadow).

Fase 2: Pembuatan Komponen UI Global

Membuat komponen reusable: Button.astro, Card.astro, Badge.astro, Navigation.astro.

Fase 3: Implementasi Layout & Konten

Menyusun konten statis pada halaman utama (Hero, Portofolio, About, Skills, Contact).

Fase 4: Integrasi Form & Animasi

Integrasi pengiriman form kontak menggunakan Web3Forms.

Penambahan interaksi micro-animation (efek hover neo-brutalis pada tombol dan card).

Fase 5: Audit & Deployment

Pengujian responsivitas pada perangkat mobile.

Menjalankan audit Google Lighthouse (memastikan skor >95% di semua metrik).

Deploy ke platform hosting (Vercel/Netlify).