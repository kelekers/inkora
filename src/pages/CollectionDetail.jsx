// src/pages/CollectionDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useDocument } from '../hooks/useDocument.js';
import { useFirestore } from '../hooks/useFirestore.js';

// --- Impor API yang Benar ---
// 1. Impor dari 'firestoreApi.js' (untuk data)
import { addDocument, deleteDocumentRecord } from '../services/firestoreApi.js';
// 2. Impor dari 'storageApi.js' (untuk file)
import { uploadDocument, deleteDocumentFile } from '../services/storageApi.js';
// -----------------------------

// Impor Komponen UI
import DocumentCard from '../components/DocumentCard.jsx';
import EditMetadataModal from '../components/EditMetadataModal.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { formatCitations } from '../services/aiService.js';
import { ChevronLeft } from 'lucide-react';

const CollectionDetail = () => {
  const { id: collectionId } = useParams();
  const { currentUser } = useAuth();

  // State (tidak berubah)
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [citationStyle, setCitationStyle] = useState('APA');
  const [bibliographyResult, setBibliographyResult] = useState('');
  const [editingDoc, setEditingDoc] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Hooks (tidak berubah)
  const { document: collection, loading: collectionLoading } = useDocument(
    'collections',
    collectionId
  );
  const { docs: documents, loading: documentsLoading } = useFirestore(
    'documents',
    currentUser?.uid,
    { field: 'collectionId', id: collectionId } 
  );
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const MAX_SIZE_BYTES = 50 * 1024 * 1024;
      if (selectedFile.size > MAX_SIZE_BYTES) {
        setError('File terlalu besar! Maksimal 50 MB.');
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    }
  };

  // --- PERBAIKAN DI 'handleUpload' ---
  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      // 1. Dapatkan KEDUA nilai (URL dan Path) dari storageApi
      const { downloadURL, storagePath } = await uploadDocument(
        file, currentUser.uid, collectionId, (progress) => setUploadProgress(progress)
      );

      // 2. Kirim KEDUA nilai itu ke firestoreApi
      await addDocument(
        currentUser.uid, 
        collectionId, 
        file.name, 
        downloadURL,
        storagePath // <-- Path-nya sekarang dikirim
      );

      setFile(null);
      if(document.getElementById('file-input')) {
         document.getElementById('file-input').value = null;
      }
    } catch (err) {
      console.error(err);
      setError('Upload gagal. Coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };
  // ------------------------------------
  
  const handleGenerateBibliography = async () => {
    setAiLoading(true);
    setAiError(null);
    setBibliographyResult('');
    const documentsWithMetadata = documents.filter(doc => doc.title || doc.author || doc.year);
    if (documentsWithMetadata.length === 0) {
      setAiError('Tidak ada dokumen dengan metadata. Silakan "Edit" dokumen dulu.');
      setAiLoading(false);
      return;
    }
    try {
      const result = await formatCitations(documentsWithMetadata, citationStyle);
      setBibliographyResult(result);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };
  
  // Handler Modal (tidak berubah)
  const openDeleteModal = (doc) => setDeletingDoc(doc);
  const closeDeleteModal = () => setDeletingDoc(null);

  // --- PERBAIKAN DI 'handleConfirmDelete' ---
  const handleConfirmDelete = async () => {
    if (!deletingDoc) return;

    // 1. Pastikan dokumen punya storagePath (dokumen lama mungkin tidak punya)
    if (!deletingDoc.storagePath) {
      setError("Gagal menghapus: Path file tidak ditemukan. (Mungkin dokumen lama?). Hapus manual dari Firebase.");
      setDeletingDoc(null);
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // 2. Gunakan path yang TEPAT dari database (tidak menebak)
      await deleteDocumentFile(deletingDoc.storagePath);

      // 3. Hapus data dari Firestore
      await deleteDocumentRecord(deletingDoc.id);

    } catch (err) {
      console.error("Gagal menghapus dokumen:", err);
      setError("Gagal menghapus file. Coba lagi.");
    } finally {
      setIsDeleting(false);
      setDeletingDoc(null); // Tutup modal
    }
  };
  // ---------------------------------------

  if (collectionLoading) {
    return <div className="p-8 md:p-12 text-center text-gray-500">Memuat data koleksi...</div>;
  }

  return (
    <>
      <main className="p-8 md:p-12">
        {/* Tombol "Kembali" */}
        <div className="mb-8">
          <Link
            to={collection ? `/shelf/${collection.shelfId}` : '/my-shelves'}
            className="flex items-center gap-1 text-sm text-primary-brand hover:text-accent-vintage-dark font-medium transition-colors"
          >
            <ChevronLeft size={18} />
            Kembali ke Rak
          </Link>
        </div>

        {/* Judul Halaman */}
        <h1 className="text-4xl font-serif text-text-dark truncate mb-8">
          {collection ? collection.name : 'Detail Koleksi'}
        </h1>
        
        {/* --- Form Upload --- */}
        <div className="mb-8 p-6 bg-background-card rounded-xl shadow-lg border border-gray-100">
           <h2 className="text-xl font-serif text-text-dark mb-4">Upload Dokumen Baru</h2>
           <div className="flex flex-col sm:flex-row gap-4">
             <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              className="flex-grow p-3 border border-gray-300 rounded-lg text-sm
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                         file:text-sm file:font-semibold file:bg-secondary-brand/10 file:text-secondary-brand
                         hover:file:bg-secondary-brand/20 transition-all"
              accept=".pdf,.epub"
              disabled={isUploading}
            />
            <button
              onClick={handleUpload}
              className="bg-secondary-brand hover:bg-secondary-brand/90 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 shadow-md"
              disabled={isUploading || !file}
            >
              {isUploading ? `Mengupload... ${uploadProgress.toFixed(0)}%` : 'Upload File'}
            </button>
          </div>
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div className="bg-secondary-brand h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* --- Generator AI --- */}
        <div className="mb-8 p-6 bg-background-card rounded-xl shadow-lg border border-gray-100">
           <h2 className="text-xl font-serif text-text-dark mb-4">
            Generator Daftar Pustaka (AI)
          </h2>
           <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-grow">
              <label htmlFor="style-select" className="block text-sm font-medium text-gray-700 mb-1">
                Gaya Sitasi:
              </label>
              <select
                id="style-select"
                value={citationStyle}
                onChange={(e) => setCitationStyle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-vintage-dark/50"
                disabled={aiLoading}
              >
                <option value="APA">APA (7th Edition)</option>
                <option value="Harvard">Harvard</option>
                <option value="MLA">MLA</option>
              </select>
            </div>
            <div className="sm:self-end">
              <button
                onClick={handleGenerateBibliography}
                className="w-full sm:w-auto bg-accent-vintage-dark hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 shadow-md"
                disabled={aiLoading || documents.length === 0}
              >
                {aiLoading ? "Memproses..." : "Buat Daftar Pustaka"}
              </button>
            </div>
          </div>
          {aiError && <p className="text-red-500 text-sm mt-3">{aiError}</p>}
          {bibliographyResult && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hasil (Siap di-copy):
              </label>
              <textarea
                readOnly
                value={bibliographyResult}
                className="w-full h-40 p-3 border border-primary-brand rounded-lg bg-background-light font-mono text-sm resize-none"
                placeholder="Hasil AI akan muncul di sini..."
              />
            </div>
          )}
        </div>
        
        {/* --- Daftar Dokumen --- */}
        <div className="mt-8">
          <h2 className="text-2xl font-serif text-text-dark mb-4">
            Dokumen di Koleksi Ini:
          </h2>
          <div className="mt-4">
            {documentsLoading && (
              <p className="text-gray-500">Memuat dokumen...</p>
            )}
            
            {!documentsLoading && documents.length === 0 && (
              <div className="p-10 bg-background-card rounded-xl shadow-inner border border-dashed border-gray-300">
                <p className="text-gray-500 italic text-center">
                  Kamu belum punya dokumen di koleksi ini.
                </p>
              </div>
            )}

            {!documentsLoading && documents.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {documents.map((doc) => (
                  <DocumentCard 
                    key={doc.id} 
                    doc={doc} 
                    onEdit={() => setEditingDoc(doc)}
                    onDelete={() => openDeleteModal(doc)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- Modal (tidak berubah) --- */}
      {editingDoc && (
        <EditMetadataModal 
          doc={editingDoc} 
          onClose={() => setEditingDoc(null)} 
        />
      )}
      {deletingDoc && (
        <ConfirmModal
          title="Hapus Dokumen?"
          isLoading={isDeleting}
          onCancel={closeDeleteModal}
          onConfirm={handleConfirmDelete}
        >
          <p>Apakah kamu yakin ingin menghapus dokumen ini?</p>
          <p className="font-semibold mt-2">"{deletingDoc.name}"</p>
          <p className="text-sm text-red-600 mt-2">
            Tindakan ini tidak bisa dibatalkan. File akan dihapus permanen.
          </p>
        </ConfirmModal>
      )}
    </>
  );
};

export default CollectionDetail;