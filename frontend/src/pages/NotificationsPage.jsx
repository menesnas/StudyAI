import React from 'react';

function NotificationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Bildirimler</h1>
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-300">Henüz bildirim bulunmuyor.</p>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
