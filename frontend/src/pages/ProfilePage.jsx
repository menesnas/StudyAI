import React from 'react';
import { useSelector } from 'react-redux';

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Profil</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kullanıcı Adı : {user?.username || 'Bilinmiyor'}
            </label>
            
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-posta : {user?.email || 'Bilinmiyor'}
            </label>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
