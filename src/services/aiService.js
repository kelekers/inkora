// src/services/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Ambil Kunci API dari environment
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY tidak ditemukan di .env.local");
}

// 2. Inisialisasi model (menggunakan model yang kamu temukan)
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash", // <-- Menggunakan model yang sudah kamu konfirmasi
  
  // Instruksi sistem yang lebih detail
  systemInstruction: "Kamu adalah asisten pustakawan akademik yang ahli dalam memformat daftar pustaka (bibliografi) gaya APA 7th dan Harvard. Kamu HANYA akan membalas dengan teks daftar pustaka yang sudah diformat, diurutkan berdasarkan abjad penulis. Jangan sertakan judul 'Daftar Pustaka' atau penjelasan apapun. Gunakan markdown * (satu bintang) untuk *italic* (huruf miring) pada judul jurnal atau buku."
});

/**
 * Mengirim daftar metadata dokumen LENGKAP ke AI untuk diformat.
 * @param {Array<object>} documents - Array berisi objek dokumen LENGKAP.
 * @param {string} style - Format yang diinginkan ("APA" atau "Harvard").
 * @returns {Promise<string>} - Teks daftar pustaka yang sudah diformat.
 */
export const formatCitations = async (documents, style) => {
  if (!documents || documents.length === 0) {
    return "Tidak ada metadata dokumen untuk diformat.";
  }

  // 3. Ubah array data lengkap menjadi string yang terstruktur
  // Ini adalah "UPGRADE" besarnya
  const docListString = documents
    .map(doc => {
      // Memulai dengan data umum
      let entry = `- Tipe: ${doc.docType || 'N/A'}\n` +
                  `  Penulis: ${doc.author || 'N/A'}\n` +
                  `  Tahun: ${doc.year || 'N/A'}\n` +
                  `  Judul: ${doc.title || 'N/A'}`;

      // Tambahkan field spesifik berdasarkan Tipe Dokumen
      if (doc.docType === 'Journal') {
        entry += `\n  Nama Jurnal: ${doc.publicationTitle || 'N/A'}` +
                 `\n  Volume: ${doc.volume || 'N/A'}` +
                 `\n  Nomor: ${doc.issue || 'N/A'}` +
                 `\n  Halaman: ${doc.pages || 'N/A'}` +
                 `\n  URL/DOI: ${doc.url || 'N/A'}`;
      } else if (doc.docType === 'Book') {
        entry += `\n  Judul Buku (jika bab): ${doc.publicationTitle || 'N/A'}` +
                 `\n  Penerbit: ${doc.publisher || 'N/A'}`;
      } else if (doc.docType === 'WebArticle') {
        entry += `\n  Nama Situs Web: ${doc.publicationTitle || 'N/A'}` +
                 `\n  URL: ${doc.url || 'N/A'}`;
      }
      return entry;
    })
    .join('\n\n'); // Pisahkan setiap entri dokumen dengan spasi

  // 4. Buat prompt yang lebih "pintar"
  const prompt = `
    Tolong buatkan daftar pustaka (bibliografi) berdasarkan daftar dokumen berikut.
    Format daftar pustaka harus dalam gaya: ${style} (gunakan edisi terbaru, misal APA 7th).
    
    Aturan:
    1. Gunakan data terstruktur yang diberikan untuk membuat sitasi yang akurat.
       - Untuk "Tipe: Journal", format sebagai artikel jurnal (gunakan Nama Jurnal, volume, nomor, halaman).
       - Untuk "Tipe: Book", format sebagai buku (gunakan Penerbit).
       - Untuk "Tipe: WebArticle", format sebagai artikel web (gunakan Nama Situs Web dan URL).
    2. Urutkan hasilnya berdasarkan abjad Penulis.
    3. Pastikan formatnya benar (tanda baca, huruf miring, dll).
    4. Gunakan format markdown *judul* untuk bagian yang seharusnya *italic* (miring).
    5. JANGAN tambahkan judul seperti "Daftar Pustaka".
    6. JANGAN tambahkan penjelasan apapun. Kembalikan HANYA teks daftar pustakanya.

    Data Dokumen:
    ${docListString}
  `;

  try {
    // 5. Panggil AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim(); // Kembalikan teks yang sudah bersih
    
  } catch (error) {
    console.error("Error memanggil Gemini API:", error);
    // Kita kirim pesan error yang jelas ke UI
    throw new Error("Gagal menghubungi AI. Cek koneksi atau Kunci API.");
  }
};