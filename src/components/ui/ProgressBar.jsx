// src/components/ui/ProgressBar.jsx
import React from 'react';

/**
 * Menampilkan progress bar sederhana.
 * @param {number} progress - Angka antara 0 sampai 100.
 */
const ProgressBar = ({ progress = 0 }) => {
    // Pastikan progress valid (antara 0 dan 100)
    const validProgress = Math.max(0, Math.min(100, progress));

    return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
        style={{ width: `${validProgress}%` }}
        >
        </div>
    </div>
    );
};

export default ProgressBar;