// src/pages/ShelfDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { addCollection } from '../services/firestoreApi.js';
import { useFirestore } from '../hooks/useFirestore';
import { useDocument } from '../hooks/useDocument.js'; // <- Impor baru
import CollectionItem from '../components/CollectionItem.jsx'; // <- Komponen BUKU

const ShelfDetail = () => {
  const { id: shelfId } = useParams();
  const { currentUser } = useAuth(); 
  
  // State untuk form (tidak berubah)
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Ambil data Rak ini (BARU) ---
  // Kita perlukan untuk menampilkan nama Rak di judul
  const { document: shelf, loading: shelfLoading } = useDocument(
    'shelves',
    shelfId
  );

  // --- Ambil data Koleksi ---
  const { docs: collections, loading: collectionsLoading } = useFirestore(
    'collections',
    currentUser?.uid,
    { field: 'shelfId', id: shelfId }
  );

  // Fungsi handleCreateCollection (logika tidak berubah)
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (newCollectionName.trim() === "") {
      setError("Nama koleksi tidak boleh kosong.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await addCollection(currentUser.uid, shelfId, newCollectionName);
      setNewCollectionName("");
    } catch (err) {
      console.error(err);
      setError("Gagal membuat koleksi. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilkan loading jika data rak (judul) belum siap
  if (shelfLoading) {
    return (
      <div className="p-8 w-full flex justify-center items-center">
        <p className="text-gray-500">Memuat rak...</p>
      </div>
    );
  }

  return (
    // Konten utama dengan padding
    <div className="p-8 md:p-12">
      
      {/* 1. Tombol "Kembali" & Judul Halaman */}
      <div className="mb-3">
        <Link 
          to="/my-shelves" // <- Link ke halaman "My Shelf"
          className="text-primary-brand hover:text-accent-vintage-dark transition-colors font-medium"
        >
          &larr; Kembali ke Daftar Rak
        </Link>
      </div>

      <h1 className="text-4xl font-serif text-text-dark">
        {/* Tampilkan nama rak di sini */}
        {shelf ? shelf.name : 'Detail Rak'}
      </h1>

      {/* 2. Form Create Collection (Styling baru) */}
      <div className="my-3 p-4 bg-background-card rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleCreateCollection} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Beri nama buku/koleksi baru..."
            className="flex-grow p-3 pl-6 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-secondary-brand/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-secondary-brand hover:bg-secondary-brand/90 text-white font-400 py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? "Menambahkan..." : "+ Tambah ke Rak"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* 3. Area "Rak Buku" */}
      <div className="mt-8">
        <h2 className="text-2xl font-serif text-text-dark mb-4">
          Koleksi di Rak Ini:
        </h2>
        
        <div className="mt-4">
          {collectionsLoading && (
            <p className="text-gray-500">Memuat koleksi...</p>
          )}

          {!collectionsLoading && collections.length === 0 && (
            <div className="p-10 bg-background-card rounded-xl shadow-inner border border-dashed border-gray-300">
              <p className="text-gray-500 italic text-center">
                Rak ini masih kosong. Coba tambahkan koleksi baru!
              </p>
            </div>
          )}

          {/* --- INI ADALAH "RAK BUKU" (Bookshelf) --- */}
          {/* Ini adalah dinding rak. Kita beri warna kayu muda */}
          {!collectionsLoading && collections.length > 0 && (
            <div className="
              flex flex-row flex-wrap 
              gap-x-6 gap-y-16 
              p-8 
              bg-primary-brand/10 
              rounded-lg
            ">
              {/* Kita map CollectionItem (Buku) di sini.
                'flex-wrap' akan otomatis membuat "baris" baru 
                jika tidak muat. (Ini adalah "tilemap" yang kamu minta).
                'gap-y-16' memberi jarak vertikal antar "rak".
              */}
              {collections.map((collection) => (
                <CollectionItem key={collection.id} collection={collection} />
              ))}
            </div>
          )}
          {/* ------------------------------------------- */}

        </div>
      </div>
    </div>
  );
};

export default ShelfDetail;