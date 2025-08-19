import React from 'react';

function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Ayarlar</h1>
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Genel Ayarlar</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-300">Karanlık Tema</label>
              <input 
                type="checkbox" 
                defaultChecked 
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-300">Bildirimler</label>
              <input 
                type="checkbox" 
                defaultChecked 
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Hesap Ayarları</h2>
          <div className="space-y-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Şifre Değiştir
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Hesabı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
