// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Halaman-halaman aplikasi
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx'; // Ini adalah halaman My Shelves
import ShelfDetail from './pages/ShelfDetail.jsx';
import CollectionDetail from './pages/CollectionDetail.jsx';
import Home from './pages/Home.jsx'; 

// Komponen Layout
import MainLayout from './components/layout/MainLayout.jsx';
// --- PERBAIKAN: Ganti nama impor ke nama file aslimu ---
import DocumentViewer from './pages/DocumentViewer.jsx'; 

const App = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Rute publik (Login) */}
      <Route path="/login" element={<Login />} />

      {/* --- PERBAIKAN: Rute DocumentViewer HANYA ADA DI SINI --- */}
      {/* Rute ini sekarang berdiri sendiri (tanpa MainLayout) */}
      <Route 
        path="/viewer/:docId" 
        element={currentUser ? <DocumentViewer /> : <Login />} 
      />

      {/* Rute privat yang menggunakan MainLayout (ada Sidebar) */}
      <Route element={<MainLayout />}>
        {currentUser ? (
          <>
            <Route path="/" element={<Home />} /> 
            <Route path="/my-shelves" element={<Dashboard />} /> 
            <Route path="/shelf/:id" element={<ShelfDetail />} />
            <Route path="/collection/:id" element={<CollectionDetail />} />
            
            {/* --- PERBAIKAN: Rute duplikat /viewer Dihapus dari sini --- */}

            {/* Rute dummy untuk link Sidebar lainnya */}
            {/* <Route path="/search" element={<div>Halaman Pencarian</div>} /> */}
            {/* <Route path="/bookmarks" element={<div>Halaman Bookmark</div>} /> */}
          </>
        ) : (
          // Jika belum login, redirect semua rute privat ke login
          <Route path="/*" element={<Login />} /> 
        )}
      </Route>
    </Routes>
  );
};

export default App;
