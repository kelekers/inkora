// src/hooks/useDocument.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

/**
 * Hook kustom untuk mengambil data satu dokumen secara real-time.
 * @param {string} collectionName - Nama koleksi (misal: 'collections')
 * @param {string} id - ID dokumen yang akan diambil
 */
export const useDocument = (collectionName, id) => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    if (!id) {
        setLoading(false);
        setDocument(null);
        return;
    }

    setLoading(true);
    const docRef = doc(db, collectionName, id);

    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
        setDocument({ id: doc.id, ...doc.data() });
        setError(null);
        } else {
        setError("Dokumen tidak ditemukan.");
        setDocument(null);
        }
        setLoading(false);
    }, (err) => {
        console.error("Error fetching document:", err);
        setError("Gagal mengambil data.");
        setLoading(false);
    });

    // Cleanup listener
    return () => unsubscribe();

    }, [collectionName, id]);

    return { document, loading, error };
};