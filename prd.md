Product Requirements Document (PRD)

Product Name: GlassBento UI Builder

Version: 1.0 (Draft)

Platform: Web Application (Client-Side Static)

Deployment: GitHub Pages (via GitHub Actions)

1. Executive Summary

GlassBento UI Builder adalah web-based developer tool yang memungkinkan desainer dan frontend engineer untuk merancang, memvisualisasikan, dan mengekstrak kode untuk komponen antarmuka bergaya Bento Grid dan Glassmorphism. Dengan memanfaatkan Islands Architecture dari Astro dan reaktivitas dari React, aplikasi ini menawarkan performa tingkat tinggi (Zero JS di halaman statis) dengan interaktivitas instan tanpa memerlukan backend atau database.

2. Problem Statement & Vision

Masalah:
Membangun Bento Grid yang responsif seringkali membutuhkan perhitungan CSS Grid yang kompleks (menggunakan grid-template-areas atau span). Ditambah lagi, efek glassmorphism yang realistis membutuhkan kalibrasi berulang antara backdrop-filter, box-shadow, border transparan, dan background-color dengan opacity tertentu agar terlihat bagus di berbagai latar belakang, sekaligus tetap memenuhi standar aksesibilitas (kontras warna).
Visi:
Menyediakan lingkungan visual (WYSIWYG) di mana pengguna dapat mengonfigurasi tata letak dan efek visual secara presisi, lalu mengubahnya menjadi kode production-ready (CSS, Tailwind, atau React Component) dalam hitungan detik.

3. User Personas

Dina, Junior UI/UX Designer: Memahami konsep visual desain modern, tetapi kesulitan menerjemahkan efek glassmorphism dan grid layout dari Figma ke dalam kode CSS yang akurat untuk diserahkan kepada developer.

Raka, Frontend Developer (React/Tailwind): Ingin mempercepat alur kerja (workflow) pembuatan landing page. Ia tidak ingin menghafal utilitas Tailwind untuk grid spanning dan efek kaca yang kompleks.

4. Comprehensive Feature Specifications

4.1. Advanced Bento Grid Engine

Visual Grid Builder: Pengguna dapat menentukan ukuran dasar grid (mis. 12-column grid).

Drag-to-Span: Kemampuan untuk menarik (drag) ujung kotak komponen untuk membuatnya membentang (span) melintasi beberapa kolom atau baris.

Responsive Breakpoints: Toggle untuk mengatur tata letak grid pada tampilan Desktop, Tablet, dan Mobile. Generator kode akan otomatis menghasilkan media queries atau prefix responsif Tailwind (mis. md:col-span-2).

Strict Aesthetic Constraints: Border-radius dikunci pada skala proporsional (8px, 12px, 16px, 24px, 32px) untuk mencegah desain yang tidak seimbang.

4.2. Precision Glassmorphism Engine

Multi-Layered Lighting: Tidak hanya backdrop-filter: blur, tetapi juga kontrol atas efek pencahayaan tepi (edge highlight) menggunakan inset box-shadow putih transparan.

Noise Texture Overlay: Opsi toggle untuk menambahkan tekstur grain/noise SVG ultra-ringan di atas kaca untuk memberikan efek material frosted glass yang realistis.

Dynamic Backdrop Testing: Canvas preview harus memiliki opsi latar belakang yang beragam (Solid Color, Mesh Gradient animasi, dan Unsplash Image) untuk memastikan efek kaca tetap terlihat jelas di berbagai kondisi latar.

4.3. Accessibility (a11y) Guardrails

Real-time Contrast Checker: Sistem otomatis mendeteksi rasio kontras teks (WCAG 2.1) di atas elemen glassmorphism terhadap latar belakang (background). Jika teks sulit dibaca, sistem akan memunculkan peringatan visual (warna merah/kuning) dan menyarankan perubahan opacity atau warna teks.

4.4. Code Generation & Export Options

Sistem export kode langsung (live code block dengan fitur syntax highlighting dan copy-to-clipboard). Tersedia output untuk:

Vanilla HTML/CSS: Menggunakan CSS Grid mentah dan variabel (CSS Custom Properties).

Tailwind CSS: Menghasilkan markup HTML dengan utility classes yang bersih.

React/JSX: Mengekspor sebagai komponen fungsional React (menggabungkan markup dan Tailwind).

5. Technical Architecture & Strategy

5.1. Tech Stack

Core Framework: Astro (v4+). Digunakan untuk routing statis, SEO, dan layouting dasar.

Interactive UI (Astro Islands): React 18. Dirender hanya pada area builder (client:load).

State Management: Zustand. Dipilih karena lebih ringan dan boilerplate-free dibandingkan Redux, ideal untuk mengelola state yang kompleks (posisi grid, nilai slider warna, opsi ekspor).

Styling: Tailwind CSS.

Icons & Assets: Lucide React (ikon) dan tata letak canvas SVG murni.

5.2. Data Flow

Pengguna berinteraksi dengan kontrol React (Slider, Color Picker).

State diperbarui di Zustand store.

Perubahan state memicu re-render pada komponen Preview Canvas dan komponen Code Generator secara bersamaan.

Pustaka kompilasi string (logika kustom) menerjemahkan state Zustand menjadi string HTML/CSS/JSX mentah.

5.3. Performance Budget

Lighthouse Score Target: 95+ (Performance, Accessibility, Best Practices, SEO).

Initial JavaScript Payload: < 150KB (Gzipped). Astro harus memastikan komponen statis (Header, Footer, Landing copy) adalah Zero JS.

No Database: Aplikasi 100% client-side. Tidak ada latency server saat menghasilkan kode.

6. Non-Goals (Out of Scope for v1.0)

Untuk menjaga scope proyek tetap realistis dan dapat di-deploy ke GitHub Pages murni:

Tidak ada fitur User Authentication (Login/Register).

Tidak ada penyimpanan ke Cloud / Database (pengguna tidak bisa menyimpan preset desain mereka ke server, meskipun ke depannya bisa dipertimbangkan menggunakan localStorage peramban).

Tidak mendukung framework CSS lama seperti Bootstrap.

7. Development Milestones

Phase 1: Design & Architecture (Minggu 1)

Wireframing di Figma.

Setup repositori, inisialisasi Astro + React + Tailwind + Zustand.

Phase 2: The Glass Engine (Minggu 2)

Membuat algoritma pembuat efek kaca (blur, opacity, noise, shadow).

Menghubungkan engine dengan UI kontrol (Slider, Color Picker).

Phase 3: The Bento Grid Engine (Minggu 3)

Membangun fungsionalitas drag & atur ukuran (grid-spanning).

Menerapkan logika responsivitas.

Phase 4: Output & Polish (Minggu 4)

Membangun generator teks untuk output kode (Tailwind/CSS/React).

Mengintegrasikan algoritma pengecek kontras aksesibilitas.

Uji coba responsivitas web tool dan peluncuran (CI/CD) ke GitHub Pages.