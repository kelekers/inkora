// src/pages/DocumentViewer.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDocument } from '../hooks/useDocument.js';
import { updateDocumentProgress } from '../services/firestoreApi.js';
import { ChevronLeft, Check } from 'lucide-react'; // Ikon baru

const DocumentViewer = () => {
  const { docId } = useParams();

  // 1. Ambil data dokumen
  const { document: docData, loading: docLoading } = useDocument('documents', docId);

  // 2. Ambil data koleksi
  const [collectionId, setCollectionId] = useState(null);
  useEffect(() => {
    if (docData) {
      setCollectionId(docData.collectionId);
    }
  }, [docData]);
  const { document: collectionData } = useDocument('collections', collectionId);

  // State Progress
  const [localProgress, setLocalProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (docData) {
      setLocalProgress(docData.progress || 0);
    }
  }, [docData]);

  // 3. Atur judul tab browser
  useEffect(() => {
    if (docData && collectionData) {
      document.title = `[${collectionData.name}] - ${docData.name}`;
    }
    return () => { document.title = 'Inkora Library'; };
  }, [docData, collectionData]);

  // ... (Semua fungsi handler: handleSliderChange, handleProgressSave, handleMarkAsDone) ...
  const handleSliderChange = (e) => {
    setLocalProgress(Number(e.target.value));
  };

  const handleProgressSave = async () => {
    if (!docId) return;
    setIsUpdating(true);
    try {
      await updateDocumentProgress(docId, localProgress);
    } catch (err) {
      console.error("Gagal update progress:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsDone = async () => {
    setLocalProgress(100);
    setIsUpdating(true);
    try {
      await updateDocumentProgress(docId, 100);
    } catch (err) {
      console.error("Gagal update progress:", err);
    } finally {
      setIsUpdating(false);
    }
  };


  if (docLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-background-light">
        <p className="text-gray-500">Memuat dokumen...</p>
      </div>
    );
  }

  if (!docData) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-background-light">
        <p className="text-red-500">Dokumen tidak ditemukan.</p>
      </div>
    );
  }

  return (
    // Layout Viewer: Header + Konten iFrame
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* --- Header BARU (Dengan Perbaikan Font) --- */}
      {/* PERBAIKAN: Menambahkan 'font-sans' di sini 
        untuk beralih dari 'Bellefair' (default) kembali ke 'Inter',
        sehingga 'font-semibold' tidak "pecah".
      */}
      <header className="flex-shrink-0 bg-background-card shadow-md p-3 px-4 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          
          {/* Kiri: Tombol Kembali & Info Judul */}
          <div className="flex-grow truncate mb-2 sm:mb-0">
            <Link
              to={`/collection/${docData.collectionId}`} // Kembali ke Koleksi
              className="flex items-center gap-1 text-sm text-primary-brand hover:text-accent-vintage-dark font-medium transition-colors"
            >
              <ChevronLeft size={18} />
              Kembali ke Koleksi
            </Link>
            <div className="truncate mt-1" title={docData.name}>
              <span className="text-sm font-semibold text-text-dark">
                {docData.name}
              </span>
            </div>
          </div>

          {/* Kanan: Kontrol Progress */}
          <div className="flex-shrink-0 flex items-center gap-3 w-full sm:w-auto sm:max-w-xs">
            <span className="text-sm font-semibold text-text-dark w-10 text-right">
              {localProgress}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={localProgress}
              onChange={handleSliderChange}
              onMouseUp={handleProgressSave}
              onTouchEnd={handleProgressSave}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={handleMarkAsDone}
              className="flex items-center gap-1 text-xs bg-secondary-brand hover:bg-secondary-brand/90 text-white font-semibold py-1 px-3 rounded-md"
              disabled={isUpdating}
            >
              <Check size={14} />
              Selesai
            </button>
          </div>
        </div>
      </header>
      
      {/* Konten PDF (iFrame) */}
      <main className="flex-grow">
        <iframe
          src={`${docData.url}#view=fitH`}
          title={docData.name}
          className="w-full h-full border-0"
        ></iframe>
      </main>
    </div>
  );
};

export default DocumentViewer;