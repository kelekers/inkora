// src/components/CollectionItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Komponen untuk menampilkan satu Koleksi sebagai BUKU di rak.
 * @param {object} collection - Objek koleksi dari Firestore.
 */
const CollectionItem = ({ collection }) => {

const colors = [
  'bg-amber-800/90', 'bg-amber-700/80', 'bg-yellow-900/80',
  'bg-emerald-900/80', 'bg-green-800/80', 'bg-lime-900/70', 'bg-olive-800/80',
  'bg-purple-900/80', 'bg-violet-800/80', 'bg-gray-700/80', 'bg-indigo-900/80',
  'bg-orange-900/80', 'bg-rose-800/80', 'bg-red-800/80', 'bg-stone-700/80',
  'bg-red-900/80', 'bg-rose-900/80', 'bg-brown-900/80',
  'bg-blue-900/80', 'bg-cyan-900/80', 'bg-sky-900/80',
  'bg-stone-800/80', 'bg-neutral-800/80', 'bg-zinc-800/80',
  'bg-primary-brand/90',
  'bg-secondary-brand/90',
  'bg-accent-vintage-dark/90',
  'bg-accent-vintage/90',
  'bg-red-900/80',
  'bg-blue-900/80',
];

// Logika random tapi konsisten per shelf
function getShelfColor(shelfId) {
  // Buat seed dari ID biar warna tetap sama setiap kali
  let seed = 0;
  for (let i = 0; i < shelfId.length; i++) {
    seed = (seed * 31 + shelfId.charCodeAt(i)) % 233280;
  }

  // Ubah seed ke angka 0–1 (pseudo-random deterministik)
  const random = (seed / 233280) % 1;
  const colorIndex = Math.floor(random * colors.length);

  return colors[colorIndex];
}

  return (
    <Link
      to={`/collection/${collection.id}`}
      title={collection.name}
      // Kontainer buku dengan perspektif
      className="group"
    >
      <div 
        // Ini adalah SAMPUL BUKU
        className={`w-36 h-52 ${bgColor} rounded-md shadow-lg
                   flex flex-col justify-between p-4
                   transition-all duration-300 ease-out
                   transform hover:scale-105 hover:-translate-y-2`}
      >
        {/* Tepi kiri buku (efek 3D) */}
        <div className="absolute top-0 left-0 w-2 h-full bg-black/20 rounded-l-md"></div>
        
        {/* Judul Buku di Sampul */}
        <h3 className="text-white font-serif text-lg font-400 break-words">
          {collection.name}
        </h3>
        
        {/* Detail kecil di bawah */}
        <p className="text-white/70 text-xs font-sans">
          (Buka Koleksi)
        </p>
      </div>
    </Link>
  );
};

export default CollectionItem;