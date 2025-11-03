// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Bookmark, Library, Folder, File, X } from 'lucide-react'; // Impor ikon X

// Terima props 'isOpen' dan 'setIsOpen'
const Sidebar = ({ isOpen, setIsOpen }) => {

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "flex items-center gap-3 rounded-3xl p-3 pl-5 transition-colors"; 
    if (isActive) {
      return `${baseClasses} bg-primary-brand text-white shadow-md`;
    } else {
      return `${baseClasses} text-text-dark hover:bg-gray-200`;
    }
  };

  return (
    <>
      {/* 1. Overlay (Hanya untuk Mobile) */}
      {/* Muncul saat 'isOpen', dan menutup sidebar saat diklik */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* 2. Sidebar Container */}
      <aside 
        className={`w-64 h-screen bg-white p-6 flex flex-col border-r border-gray-200 
                   fixed md:static z-30 
                   transition-transform duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:translate-x-0`}
      >
        
        {/* Header Sidebar: Logo & Tombol Tutup (Mobile) */}
        <div className="flex justify-between items-center mb-10">
          <div className="pl-5"> 
            <Link to="/" className="text-4xl font-script text-primary-brand">
              Inkora
            </Link>
          </div>
          {/* Tombol Tutup (Hanya di Mobile) */}
          <button 
            className="md:hidden text-text-dark"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigasi DISCOVER */}
        <div className="mb-8">
          <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3 pl-5">
            Discover
          </h3>
          <nav className="flex flex-col gap-2">
            <NavLink to="/" end className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              <Search size={20} />
              <span>Search</span>
            </NavLink>
            <NavLink to="/bookmarks" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              <Bookmark size={20} />
              <span>Bookmarks</span>
            </NavLink>
          </nav>
        </div>

        {/* Navigasi LIBRARY */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3 pl-5">
            Library
          </h3>
          <nav className="flex flex-col gap-2">
            <NavLink to="/my-shelves" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              <Library size={20} />
              <span>My Shelf</span>
            </NavLink>
            <NavLink to="/collections" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              <Folder size={20} />
              <span>My Collection</span>
            </NavLink>
            <NavLink to="/files" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              <File size={20} />
              <span>My File</span>
            </NavLink>
          </nav>
        </div>
        
      </aside>
    </>
  );
};

export default Sidebar;