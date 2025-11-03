// src/hooks/useFirestore.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'; // <-- Tambahkan 'limit'

/**
 * Hook kustom untuk mengambil data dari koleksi Firestore secara real-time.
 * @param {string} collectionName - Nama koleksi
 * @param {string} userId - ID pengguna
 * @param {Object} filter - (Opsional) Filter tambahan, misal: { field: 'shelfId', id: '123' }
 * @param {Object} options - (Opsional) Opsi query tambahan, misal: { limit: 5 }
 */
export const useFirestore = (collectionName, userId, filter = null, options = null) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guard clause: Jangan jalankan query jika data penting belum siap
    if (!userId || (filter && !filter.id)) {
      setLoading(false);
      setDocs([]);
      return;
    }

    setLoading(true);
    setError(null);

    const collectionRef = collection(db, collectionName);

    // Array untuk menampung semua batasan query
    let queryConstraints = [
      where("ownerId", "==", userId)
    ];

    // Tambahkan filter (jika ada)
    if (filter && filter.field && filter.id) {
      queryConstraints.push(where(filter.field, "==", filter.id));
    }

    // Tambahkan pengurutan (selalu terbaru di atas)
    queryConstraints.push(orderBy("createdAt", "desc"));

    // --- PERUBAHAN BARU ---
    // Tambahkan limit (jika ada di options)
    if (options && options.limit) {
      queryConstraints.push(limit(options.limit));
    }
    // ----------------------

    // Buat query gabungan
    const q = query(collectionRef, ...queryConstraints);

    // Pasang listener onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      setDocs(documents);
      setLoading(false);
    }, (err) => {
      console.error(`Error fetching data (${collectionName}): `, err);
      setError("Gagal memuat data: " + err.message);
      setLoading(false);
    });

    // Cleanup listener
    return () => unsubscribe();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, userId, filter?.field, filter?.id, options?.limit]); // Tambahkan options.limit ke dependencies

  return { docs, loading, error };
};