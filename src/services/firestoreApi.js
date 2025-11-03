// src/services/firestoreApi.js
import { db } from '../firebase/config';
// --- PERBAIKAN: Tambahkan 'deleteDoc' ---
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc,
  deleteDoc // <-- PASTIKAN INI ADA
} from 'firebase/firestore';

/**
 * Menyimpan shelf baru ke Firestore.
 * @param {string} userId - ID pengguna yang sedang login.
 * @param {string} shelfName - Nama rak buku yang diinput pengguna.
 */
export const addShelf = (userId, shelfName) => {
  if (!userId || !shelfName) {
    return Promise.reject(new Error("User ID atau nama shelf tidak boleh kosong."));
  }

  const shelvesCollectionRef = collection(db, 'shelves');

  return addDoc(shelvesCollectionRef, {
    name: shelfName,
    ownerId: userId,
    createdAt: serverTimestamp(),
  });
};

/**
 * Menyimpan collection baru ke Firestore.
 * @param {string} userId - ID pengguna.
 * @param {string} shelfId - ID rak (parent) tempat koleksi ini berada.
 * @param {string} collectionName - Nama koleksi yang diinput pengguna.
 */
export const addCollection = (userId, shelfId, collectionName) => {
  if (!userId || !shelfId || !collectionName) {
    return Promise.reject(new Error("Data tidak lengkap."));
  }

  const collectionsRef = collection(db, 'collections');

  return addDoc(collectionsRef, {
    name: collectionName,
    ownerId: userId,
    shelfId: shelfId, 
    createdAt: serverTimestamp(),
  });
};

// --- PERBAIKAN: 'addDocument' sekarang menerima 'storagePath' ---
/**
 * Menambahkan catatan/dokumen baru ke koleksi 'documents' di Firestore.
 * @param {string} userId - ID pengguna.
 * @param {string} collectionId - ID koleksi.
 * @param {string} fileName - Nama file.
 * @param {string} fileUrl - URL download dari Firebase Storage.
 *_@param {string} storagePath - Path file di Firebase Storage.
 */
export const addDocument = (userId, collectionId, fileName, fileUrl, storagePath) => {
  // Pastikan storagePath juga ada
  if (!userId || !collectionId || !fileName || !fileUrl || !storagePath) {
    return Promise.reject(new Error("Data dokumen tidak lengkap."));
  }

  const documentsCollectionRef = collection(db, 'documents'); 

  return addDoc(documentsCollectionRef, {
    name: fileName,
    url: fileUrl,
    storagePath: storagePath, // <-- SIMPAN PATH DI SINI
    ownerId: userId,
    collectionId: collectionId,
    createdAt: serverTimestamp(),
    progress: 0, // <-- Ganti nama dari 'readProgress' (jika ada)
  });
};
// -----------------------------------------------------------------

/**
 * Mengupdate progress baca sebuah dokumen.
 */
export const updateDocumentProgress = (docId, newProgress) => {
  const progress = Math.max(0, Math.min(100, Number(newProgress)));
  const docRef = doc(db, 'documents', docId);
  return updateDoc(docRef, {
    progress: progress 
  });
};

/**
 * Mengupdate metadata (lengkap) sebuah dokumen.
 */
export const updateDocumentMetadata = (docId, metadata) => {
  if (!docId || !metadata) {
    return Promise.reject(new Error("ID Dokumen atau metadata tidak ada."));
  }
  const docRef = doc(db, 'documents', docId);
  
  return updateDoc(docRef, {
    title: metadata.title || "",
    author: metadata.author || "",
    year: metadata.year || "",
    docType: metadata.docType || "Journal",
    publicationTitle: metadata.publicationTitle || "",
    publisher: metadata.publisher || "",
    volume: metadata.volume || "",
    issue: metadata.issue || "",
    pages: metadata.pages || "",
    url: metadata.url || ""
  });
};

/**
 * Menghapus data dokumen dari koleksi 'documents' di Firestore.
 */
export const deleteDocumentRecord = (docId) => {
  if (!docId) {
    return Promise.reject(new Error("ID Dokumen tidak ada."));
  }
  
  const docRef = doc(db, 'documents', docId);
  return deleteDoc(docRef); // <-- Ini sekarang akan berfungsi
};