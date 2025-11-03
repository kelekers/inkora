// src/components/RecentFileCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react'; // Ikon file

/**
 * Kartu untuk menampilkan Dokumen Terbaru di Halaman Home.
 * @param {object} doc - Objek dokumen dari Firestore.
 */
const RecentFileCard = ({ doc }) => {
  // Generate placeholder warna sampul secara konsisten
  // berdasarkan ID dokumen, menggunakan palet tema kita
  const colors = [
    'bg-accent-vintage/70', // Soft Terracotta
    'bg-primary-brand/70',  // Cokelat Madu
    'bg-secondary-brand/70', // Hijau Sage
    'bg-accent-vintage-dark/70', // Ungu Abu-abu
  ];
  // Hash sederhana untuk memilih warna
  const colorIndex = (doc.id.charCodeAt(0) || 0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <Link 
      to={`/viewer/${doc.id}`}
      className="block group transition-all duration-300 ease-out"
      title={doc.title || doc.name}
    >
      {/* Gambar Sampul Placeholder (sesuai Figma) */}
      <div 
        className={`relative w-full h-48 ${bgColor} rounded-lg shadow-md 
                   flex items-center justify-center overflow-hidden 
                   transition-transform transform group-hover:scale-105`}
      >
        <FileText className="w-16 h-16 text-white/50" strokeWidth={1} />
        {/* Di masa depan, kita bisa ganti ini dengan thumbnail asli */}
      </div>

      {/* Judul Dokumen */}
      <div className="mt-3">
        <h4 
          className="text-sm font-400 text-text-dark truncate group-hover:text-primary-brand"
        >
          {doc.title || doc.name}
        </h4>
        {/* Kita bisa tambahkan nama koleksi di sini nanti jika perlu */}
      </div>
    </Link>
  );
};

export default RecentFileCard;