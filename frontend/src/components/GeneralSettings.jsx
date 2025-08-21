import React, { useState } from 'react';

function GeneralSettings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleDarkModeChange = (e) => {
    setDarkMode(e.target.checked);
    // Burada tema değişikliği işlemleri yapılabilir
    console.log('Karanlık tema:', e.target.checked ? 'Açık' : 'Kapalı');
  };

  const handleNotificationsChange = (e) => {
    setNotifications(e.target.checked);
    console.log('Bildirimler:', e.target.checked ? 'Açık' : 'Kapalı');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Genel Ayarlar</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-gray-300">Karanlık Tema</label>
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
