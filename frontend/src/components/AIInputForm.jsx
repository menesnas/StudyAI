import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAIPlan } from '../redux/features/plans/plansSlice';

function AIInputForm() {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createAIPlan(message));
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Öğrenmek istediğiniz konuyu yazın..."
          className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Plan Oluştur
        </button>
      </div>
    </form>
  );
}

export default AIInputForm;