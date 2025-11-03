// src/services/storageApi.js
import { storage } from '../firebase/config';
// --- PERBAIKAN: Tambahkan 'deleteObject' ---
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject // <-- PASTIKAN INI ADA
} from 'firebase/storage';

/**
 * Meng-upload file ke Firebase Storage.
 * @param {File} file - File yang akan di-upload.
 * @param {string} userId - ID pengguna.
 * @param {string} collectionId - ID koleksi.
 * @param {function} onProgress - (Opsional) Callback untuk update progress upload.
 * @returns {Promise<{downloadURL: string, storagePath: string}>} - Promise yang resolve dengan URL dan Path.
 */
export const uploadDocument = (file, userId, collectionId, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!file || !userId || !collectionId) {
      return reject(new Error("Argumen tidak lengkap untuk upload file."));
    }

    // 1. Ini adalah path yang kita BUTUHKAN
    const storagePath = `documents/${userId}/${collectionId}/${file.name}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error("Error uploading file:", error);
        reject(error);
      },
      () => {
        // 4. Jika SUKSES, ambil Download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // --- PERBAIKAN: Kembalikan Objek, bukan string ---
          resolve({ downloadURL, storagePath }); 
        });
      }
    );
  });
};

/**
 * Menghapus file dokumen dari Firebase Storage.
 * @param {string} filePath - Path lengkap file di Storage.
 */
export const deleteDocumentFile = (filePath) => {
  if (!filePath) {
    return Promise.reject(new Error("Path file tidak ada."));
  }

  const storageRef = ref(storage, filePath);
  return deleteObject(storageRef); // <-- Ini sekarang akan berfungsi
};