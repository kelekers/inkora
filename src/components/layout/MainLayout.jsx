// src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react'; // Impor ikon "Hamburger"

const MainLayout = () => {
  // State untuk mengontrol sidebar di mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background-light">
      
      {/* 1. Sidebar */}
      {/* Kita sekarang mengirim 'isOpen' dan 'setIsOpen' sebagai props */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. Wrapper Konten Utama (Kanan) */}
      <div className="flex-1 flex flex-col h-screen">
        
        {/* --- Header Mobile (Hanya muncul di HP) --- */}
        {/* 'md:hidden' berarti 'sembunyikan di medium screen (desktop) ke atas' */}
        <header className="md:hidden bg-background-card p-4 shadow-md flex items-center sticky top-0 z-10">
          {/* Tombol Hamburger */}
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="text-text-dark" />
          </button>
          {/* Judul di tengah (opsional, tapi bagus untuk HP) */}
          <h1 className="text-xl font-serif text-primary-brand text-center flex-1">
            Inkora
          </h1>
          {/* Kita beri 1 div kosong agar judul pas di tengah */}
          <div className="w-6"></div>
        </header>
        
        {/* 3. Konten Halaman (Ini yang akan scroll) */}
        <main className="flex-1 overflow-y-auto">
          {/* Halaman (Dashboard, ShelfDetail) akan dirender di sini */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default MainLayout;