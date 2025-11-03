// src/components/layout/ContentHeader.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut } from 'lucide-react';

/**
 * Header untuk area konten utama.
 * @param {object} props
 * @param {string} props.title - Judul halaman (cth: "My Shelf" atau "Discover")
 * @param {boolean} [props.showSearch=true] - Tampilkan search bar?
 */
const ContentHeader = ({ title, showSearch = true }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      {/* Kiri: Judul atau Search Bar */}
      <div className="flex-1 w-full">
        {showSearch ? (
          // Tampilkan Search Bar (sesuai Figma)
          <div className="relative">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
              size={20} 
            />
            <input
              type="text"
              placeholder="Search files, collections, shelves..."
              className="w-full h-11 bg-background-card border border-gray-200 rounded-3xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-brand/50"
            />
          </div>
        ) : (
          // Tampilkan Judul (jika search tidak aktif)
          <h1 className="text-4xl font-serif text-text-dark">{title}</h1>
        )}
      </div>

      {/* Kanan: Info Pengguna & Logout */}
      <div className="flex-shrink-0 flex items-center gap-4 self-end md:self-auto">
        <span className="text-text-dark text-sm hidden sm:block">
          Halo, {currentUser?.displayName || 'Pengguna'}
        </span>
        <button
          onClick={handleLogout}
          title="Logout"
          // Tombol Logout bulat (sesuai Figma)
          className="bg-accent-vintage-dark/80 hover:bg-accent-vintage-dark text-white rounded-full h-12 w-12 flex items-center justify-center transition-colors shadow-md"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default ContentHeader;