// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

// 1. Buat Context
const AuthContext = createContext();

// 2. Buat Hook kustom untuk mempermudah
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Buat Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // State untuk cek status auth

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set user jika login, atau null jika logout
      setLoading(false); // Selesai loading
    });

    // Cleanup listener saat komponen di-unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
  };

  // Jangan render aplikasi sebelum status auth jelas
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};