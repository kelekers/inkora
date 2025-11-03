// src/pages/Home.jsx
import React from 'react';
import ContentHeader from '../components/layout/ContentHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFirestore } from '../hooks/useFirestore.js';
import RecentFileCard from '../components/RecentFileCard.jsx';
import ShelfItem from '../components/ShelfItem.jsx'; // Untuk recent shelf
import CollectionItem from '../components/CollectionItem.jsx'; // Untuk recent collection

const Home = () => {
  const { currentUser } = useAuth();

  // Ambil 5 dokumen terbaru
  const { docs: recentDocuments, loading: documentsLoading } = useFirestore(
    'documents', 
    currentUser?.uid, 
    null, 
    { limit: 5 }
  );

  // Ambil 3 koleksi terbaru
  const { docs: recentCollections, loading: collectionsLoading } = useFirestore(
    'collections', 
    currentUser?.uid, 
    null, 
    { limit: 3 }
  );

  // Ambil 3 rak terbaru
  const { docs: recentShelves, loading: shelvesLoading } = useFirestore(
    'shelves', 
    currentUser?.uid, 
    null, 
    { limit: 3 }
  );

  return (
    <div className="min-h-screen p-8">
      {/* Header Konten (dengan search bar) */}
      <ContentHeader showSearch={true} />

      {/* --- Bagian Recent Files --- */}
      <section className="mb-10">
        <h2 className="text-2xl font-serif text-text-dark mb-5 border-b border-gray-200 pb-2">
          Recent Files
        </h2>
        {documentsLoading && <p className="text-gray-500">Memuat dokumen terbaru...</p>}
        {(!documentsLoading && recentDocuments.length === 0) && (
          <p className="text-gray-500 italic">Belum ada dokumen yang diupload.</p>
        )}
        {!documentsLoading && recentDocuments.length > 0 && (
          <div className="flex flex-row flex-wrap gap-8">
            {recentDocuments.map(doc => (
              <RecentFileCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </section>

      {/* --- Bagian Recent Collections --- */}
      <section className="mb-10">
        <h2 className="text-2xl font-serif text-text-dark mb-5 border-b border-gray-200 pb-2">
          Recent Collections
        </h2>
        {collectionsLoading && <p className="text-gray-500">Memuat koleksi terbaru...</p>}
        {(!collectionsLoading && recentCollections.length === 0) && (
          <p className="text-gray-500 italic">Belum ada koleksi yang dibuat.</p>
        )}
        {!collectionsLoading && recentCollections.length > 0 && (
          <div className="flex flex-row flex-wrap gap-8">
            {recentCollections.map(collection => (
              <CollectionItem key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </section>

      {/* --- Bagian Recent Shelves --- */}
      <section className="mb-10">
        <h2 className="text-2xl font-serif text-text-dark mb-5 border-b border-gray-200 pb-2">
          Recent Shelves
        </h2>
        {shelvesLoading && <p className="text-gray-500">Memuat rak terbaru...</p>}
        {(!shelvesLoading && recentShelves.length === 0) && (
          <p className="text-gray-500 italic">Belum ada rak buku yang dibuat.</p>
        )}
        {!shelvesLoading && recentShelves.length > 0 && (
          <div className="flex flex-row flex-wrap gap-8">
            {recentShelves.map(shelf => (
              <ShelfItem key={shelf.id} shelf={shelf} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;