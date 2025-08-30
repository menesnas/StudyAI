import React from 'react';
import { useSelector } from 'react-redux';

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-6 dark:bg-gray-900 bg-gray-100 min-h-screen transition-colors duration-200">
      <h1 className="text-2xl font-bold dark:text-white text-gray-900 mb-6">Profil</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
              Kullanıcı Adı : {user?.username || 'Bilinmiyor'}
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
              E-posta : {user?.email || 'Bilinmiyor'}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
