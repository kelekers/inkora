// src/pages/Login.jsx
import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config'; // Impor dari config
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Fungsi untuk handle login
  const handleLogin = async () => {
    try {
      // 1. Tampilkan pop-up login Google
      await signInWithPopup(auth, googleProvider);
      
      // 2. Jika berhasil, React Router akan
      //    mengarahkan ke dashboard. Kita bisa paksa dengan navigate()
      //    tapi ProtectedRoute akan handle ini juga.
      //    Kita tambahkan navigate untuk memastikan.
      navigate('/');
    } catch (error) {
      console.error("Error logging in with Google: ", error);
      // Tampilkan pesan error ke pengguna jika perlu
    }
  };

  // Jika pengguna SUDAH login (misal buka tab baru),
  // jangan tampilkan halaman login, langsung arahkan ke dashboard.
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  // (Ini styling pakai Tailwind, minimalis)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-lg shadow-xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-5 text-gray-800">
          Perpustakaan Riset
        </h1>
        <p className="mb-8 text-gray-600">
          Silakan login dengan akun Google untuk melanjutkan.
        </p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg w-full"
        >
          Login dengan Google
        </button>
      </div>
    </div>
  );
};

export default Login;