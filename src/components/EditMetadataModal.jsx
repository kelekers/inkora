// src/components/EditMetadataModal.jsx
import React, { useState, useEffect } from 'react';
import { updateDocumentMetadata } from '../services/firestoreApi';

/**
 * Komponen Modal (pop-up) untuk mengedit metadata dokumen.
 * @param {object} doc - Objek dokumen yang akan diedit.
 * @param {function} onClose - Fungsi untuk menutup modal.
 */
const EditMetadataModal = ({ doc, onClose }) => {
  // State untuk menyimpan data form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [docType, setDocType] = useState('Journal'); // Default ke Jurnal
  const [publicationTitle, setPublicationTitle] = useState(''); // Nama Jurnal/Buku
  const [publisher, setPublisher] = useState(''); // Hanya untuk Buku
  const [volume, setVolume] = useState(''); // Hanya untuk Jurnal
  const [issue, setIssue] = useState(''); // Hanya untuk Jurnal
  const [pages, setPages] = useState(''); // Hanya untuk Jurnal
  const [url, setUrl] = useState(''); // Untuk Artikel Web/Jurnal

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Isi form dengan data yang sudah ada saat modal dibuka
  useEffect(() => {
    if (doc) {
      setTitle(doc.title || '');
      setAuthor(doc.author || '');
      setYear(doc.year || '');
      setDocType(doc.docType || 'Journal'); 
      setPublicationTitle(doc.publicationTitle || '');
      setPublisher(doc.publisher || '');
      setVolume(doc.volume || '');
      setIssue(doc.issue || '');
      setPages(doc.pages || '');
      setUrl(doc.url || '');
    }
  }, [doc]);

  // Fungsi saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const metadata = { 
      title, 
      author, 
      year, 
      docType, 
      publicationTitle,
      publisher,
      volume,
      issue,
      pages,
      url
    };

    try {
      // Panggil fungsi API yang sudah di-update
      await updateDocumentMetadata(doc.id, metadata);
      setIsLoading(false);
      onClose(); 
    } catch (err) {
      console.error("Gagal update metadata:", err);
      setError("Gagal menyimpan. Coba lagi.");
      setIsLoading(false);
    }
  };

  if (!doc) return null;

  return (
    // Lapisan overlay (latar belakang gelap)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} 
    >
      {/* Konten Modal (kotak putih) */}
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" // Menambah max-h dan overflow
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Metadata</h2>
        <p className="text-sm text-gray-500 mb-1">
          File: <span className="font-medium text-gray-700">{doc.name}</span>
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Tipe Dokumen */}
          <div className="mb-4">
            <label htmlFor="docType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Dokumen
            </label>
            <select
              id="docType"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Journal">Jurnal Ilmiah</option>
              <option value="Book">Buku</option>
              <option value="WebArticle">Artikel Web</option>
              <option value="Other">Lain-lain</option>
            </select>
          </div>

          {/* Judul */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Judul {docType === "Book" ? "Buku" : docType === "Journal" ? "Artikel" : docType === "WebArticle" ? "Artikel Web" : "Dokumen"}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Contoh: ${docType === "Book" ? "Pengantar Ilmu Komunikasi" : docType === "Journal" ? "Analisis Wacana Media Sosial" : "10 Cara Belajar Efektif"}`}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Penulis */}
          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Penulis
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Contoh: Budi, A. (atau Budi & Ani)"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Tahun */}
          <div className="mb-4">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Tahun Terbit
            </label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Contoh: 2024"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Field spesifik Jurnal */}
          {docType === "Journal" && (
            <>
              <div className="mb-4">
                <label htmlFor="publicationTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Jurnal
                </label>
                <input
                  type="text"
                  id="publicationTitle"
                  value={publicationTitle}
                  onChange={(e) => setPublicationTitle(e.target.value)}
                  placeholder="Contoh: Jurnal Ilmu Komunikasi"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4 flex gap-4">
                <div className="w-1/3">
                  <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                    Vol.
                  </label>
                  <input
                    type="text"
                    id="volume"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="Contoh: 10"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="w-1/3">
                  <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">
                    No.
                  </label>
                  <input
                    type="text"
                    id="issue"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Contoh: 2"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="w-1/3">
                  <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
                    Halaman
                  </label>
                  <input
                    type="text"
                    id="pages"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="Contoh: 120-135"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL/DOI (Opsional)
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Contoh: https://doi.org/10.xxxx atau link jurnal"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}

          {/* Field spesifik Buku */}
          {docType === "Book" && (
            <>
              <div className="mb-4">
                <label htmlFor="publicationTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Buku (jika berbeda dari judul utama)
                </label>
                <input
                  type="text"
                  id="publicationTitle"
                  value={publicationTitle}
                  onChange={(e) => setPublicationTitle(e.target.value)}
                  placeholder="Contoh: Komunikasi Massa: Teori dan Praktik"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
                  Penerbit
                </label>
                <input
                  type="text"
                  id="publisher"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="Contoh: Prenada Media"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}

          {/* Field spesifik Artikel Web */}
          {docType === "WebArticle" && (
            <>
              <div className="mb-4">
                <label htmlFor="publicationTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Situs Web
                </label>
                <input
                  type="text"
                  id="publicationTitle"
                  value={publicationTitle}
                  onChange={(e) => setPublicationTitle(e.target.value)}
                  placeholder="Contoh: Kompas.com"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Artikel Web
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Contoh: https://www.kompas.com/artikel-berita-ini"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}
          
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMetadataModal;