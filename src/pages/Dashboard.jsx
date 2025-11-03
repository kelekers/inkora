// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext.jsx'; 
import { useNavigate } from 'react-router-dom';
import { addShelf } from '../services/firestoreApi';
import { useFirestore } from '../hooks/useFirestore'; 
import ShelfItem from '../components/ShelfItem';      
import { LogOut } from 'lucide-react'; // Impor ikon Logout

const Dashboard = () => {
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();
  const [newShelfName, setNewShelfName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ambil data 'shelves' (rak)
  const { docs: shelves, loading: shelvesLoading } = useFirestore(
    'shelves', 
    currentUser?.uid,
    null 
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleCreateShelf = async (e) => {
    e.preventDefault(); 
    if (newShelfName.trim() === "") {
      setError("Nama rak tidak boleh kosong.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await addShelf(currentUser.uid, newShelfName);
      setNewShelfName("");
    } catch (err) {
      console.error(err);
      setError("Gagal membuat rak. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Konten utama (kanan).
    <main className="p-8 md:p-12">
      
      {/* 1. Header Konten (Sesuai Figma) */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-serif text-text-dark"> {/* <-- FONT-BOLD DIHAPUS */}
          My Shelf
        </h1>
        
        {/* Pindahkan Info User & Logout ke sini */}
        <div className="flex items-center gap-4">
          <span className="text-text-dark text-sm hidden sm:block">
            Halo, {currentUser?.displayName || currentUser?.email}
          </span>
          <button
            onClick={handleLogout}
            // Style tombol logout dari Figma
            className="flex items-center gap-2 bg-accent-vintage-dark/90 hover:bg-accent-vintage-dark text-white font-semibold py-2 px-4 rounded-2xl text-sm transition-colors shadow-md"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* 2. Form Create Shelf (Styling Baru) */}
      <div className="mb-10 p-4 bg-background-card rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleCreateShelf} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newShelfName}
            onChange={(e) => setNewShelfName(e.target.value)}
            placeholder="Beri nama rak barumu..."
            className="flex-grow p-3 pl-6 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary-brand/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            // Tombol utama (cokelat)
            className="bg-primary-brand hover:bg-primary-brand/90 text-white font-400 py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? "Membuat..." : "+ Buat Rak Baru"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      
      {/* 3. Daftar Rak */}
      <div>
        {shelvesLoading && (
          <p className="text-gray-500">Memuat rak buku...</p>
        )}

        {!shelvesLoading && shelves.length === 0 && (
          <div className="p-10 bg-background-card rounded-xl shadow-inner border border-dashed border-gray-300">
            <p className="text-gray-500 italic text-center">
              Belum ada rak buku.
            </p>
          </div>
        )}

        {!shelvesLoading && shelves.length > 0 && (
          // Layout flex-wrap untuk "Binder"
          <div className="flex flex-row flex-wrap gap-8">
            {shelves.map((shelf) => (
              <ShelfItem key={shelf.id} shelf={shelf} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;