// src/components/ConfirmModal.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Ikon peringatan

/**
 * Modal (pop-up) konfirmasi untuk tindakan berbahaya.
 * @param {object} props
 * @param {string} props.title - Judul modal (misal: "Hapus Dokumen?")
 * @param {React.ReactNode} props.children - Teks isi modal (misal: "Tindakan ini...")
 * @param {function} props.onConfirm - Fungsi yang dijalankan jika "Ya, Hapus" diklik.
 * @param {function} props.onCancel - Fungsi yang dijalankan jika "Batal" diklik.
 * @param {boolean} props.isLoading - Jika true, tombol akan disable.
 */
const ConfirmModal = ({ title, children, onConfirm, onCancel, isLoading }) => {
  return (
    // Lapisan overlay (latar belakang gelap)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onCancel} // Menutup modal jika klik di luar area
    >
      {/* Konten Modal (kotak putih) */}
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal ikut menutup
      >
        <div className="flex items-start gap-4">
          {/* Ikon Peringatan */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>

          {/* Konten Teks */}
          <div className="flex-grow">
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-2">
              {title}
            </h2>
            <div className="text-sm text-gray-600">
              {children}
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            // Tombol Hapus (berbahaya) berwarna merah
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;