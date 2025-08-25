import React from 'react';
import { useSelector } from 'react-redux';

function ResourcesPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Önerilen Kaynaklar</h1>
    </div>
  );
}

export default ResourcesPage;
