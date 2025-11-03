// src/components/DocumentCard.jsx
// src/components/DocumentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Impor ikon baru: FileText, Edit2, dan Trash2
import { FileText, Edit2, Trash2 } from 'lucide-react'; 
import ProgressBar from './ui/ProgressBar';

/**
 * Kartu untuk menampilkan satu Dokumen di halaman CollectionDetail.
 * @param {object} doc - Objek dokumen dari Firestore.
 * @param {function} onEdit - Fungsi untuk memanggil modal edit.
 * @param {function} onDelete - Fungsi untuk memanggil modal hapus.
 */
const DocumentCard = ({ doc, onEdit, onDelete }) => {

  // Generate placeholder warna sampul
  const colors = [
    'bg-accent-vintage/70', 'bg-primary-brand/70', 
    'bg-secondary-brand/70', 'bg-accent-vintage-dark/70',
    'bg-red-900/80', 'bg-blue-900/80'
  ];
  const colorIndex = (doc.id.charCodeAt(0) || 0) % colors.length;
  const bgColor = colors[colorIndex];

  const hasThumbnail = doc.thumbnailUrl; 

  // --- Fungsi helper untuk tombol ---
  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(doc); // Panggil fungsi onEdit dari parent
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(doc); // Panggil fungsi onDelete dari parent
  };
  // ---------------------------------

  return (
    <div className="bg-background-card rounded-xl shadow-lg border border-gray-100 flex flex-col group">
      
      {/* Bagian Gambar (Thumbnail atau Placeholder) */}
      <div className="relative w-full h-52">
        {/* --- Area Tombol Aksi (BARU) --- */}
        <div className="absolute top-2 right-2 z-10 flex gap-2 
                      opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Tombol Edit */}
          <button
            onClick={handleEditClick}
            className="p-2 bg-white/80 hover:bg-white rounded-full shadow"
            title="Edit Metadata"
          >
            <Edit2 size={16} className="text-text-dark" />
          </button>
          {/* Tombol Hapus (BARU) */}
          <button
            onClick={handleDeleteClick}
            className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full shadow"
            title="Hapus Dokumen"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {/* ------------------------------- */}

        {/* Gambar Thumbnail (jika ada) */}
        {hasThumbnail ? (
          <img
            src={doc.thumbnailUrl}
            alt={`Sampul ${doc.title || doc.name}`}
            className="w-full h-full object-cover rounded-t-xl"
          />
        ) : (
          // Placeholder (jika tidak ada thumbnail)
          <div className={`w-full h-full ${bgColor} rounded-t-xl flex items-center justify-center`}>
            <FileText className="w-16 h-16 text-white/50" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Bagian Info (di bawah gambar) */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Judul dan Penulis */}
        <div className="flex-grow mb-3">
          <Link
            to={`/viewer/${doc.id}`}
            title={doc.title || doc.name}
            // Hapus target="_blank" agar terbuka di tab yang sama
            className="block text-lg font-serif font-semibold text-text-dark hover:text-primary-brand truncate"
          >
            {doc.title || doc.name}
          </Link>
          {doc.author && (
            <p className="text-sm text-gray-500 mt-1 truncate">
              {doc.author} {doc.year ? `(${doc.year})` : ''}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-secondary-brand">
              {(doc.progress || 0).toFixed(0)}%
            </span>
          </div>
          <ProgressBar progress={doc.progress || 0} />
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;