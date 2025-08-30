import React, { useState } from 'react';

function GeneralSettings() {
  // Başlangıçta sistem tercihini al
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useState(() => {
    // localStorage'dan kayıtlı tercihi kontrol et, yoksa sistem tercihini kullan
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : prefersDark;
  });
  const [notifications, setNotifications] = useState(true);

  const handleDarkModeChange = (e) => {
    const isDark = e.target.checked;
    setDarkMode(isDark);
    
    // HTML class'ını güncelle
    document.documentElement.classList.toggle('dark', isDark);
    
    // Tercihi localStorage'a kaydet
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const handleNotificationsChange = (e) => {
    setNotifications(e.target.checked);
    console.log('Bildirimler:', e.target.checked ? 'Açık' : 'Kapalı');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-colors duration-200">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Genel Ayarlar</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-gray-700 dark:text-gray-300">Karanlık Tema</label>
          <input 
            type="checkbox" 
            checked={darkMode}
            onChange={handleDarkModeChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-gray-300">Bildirimler</label>
          <input 
            type="checkbox" 
            checked={notifications}
            onChange={handleNotificationsChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>
      </div>
    </div>
  );
}

export default GeneralSettings;
