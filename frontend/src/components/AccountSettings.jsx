import React, { useState } from 'react';
import { changePassword, deleteAccount } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';

function AccountSettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Şifre değiştirme form state'i
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Hesap silme form state'i
  const [deletePassword, setDeletePassword] = useState('');

  const handlePasswordChange = () => {
    setShowPasswordForm(!showPasswordForm);
    setShowDeleteForm(false);
    setMessage('');
    setError('');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccountToggle = () => {
    setShowDeleteForm(!showDeleteForm);
    setShowPasswordForm(false);
    setMessage('');
    setError('');
    setDeletePassword('');
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validasyon
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalı');
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage('Şifre başarıyla değiştirildi');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordForm(false);
        setMessage('');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Şifre değiştirme başarısız');
    } finally {
      setLoading(false);
    }
  };

  const submitDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (!window.confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await deleteAccount(deletePassword);
      setMessage('Hesap başarıyla silindi. Yönlendiriliyorsunuz...');
      
      // Redux state'ini temizle
      dispatch(logout());
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Hesap silme başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Hesap Ayarları</h2>
      
      {/* Mesaj ve Hata Gösterimi */}
      {message && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded-md">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Şifre Değiştir Butonu */}
        <button 
          onClick={handlePasswordChange}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto m-2"
        >
          {showPasswordForm ? 'İptal Et' : 'Şifre Değiştir'}
        </button>

        {/* Şifre Değiştirme Formu */}
        {showPasswordForm && (
          <form onSubmit={submitPasswordChange} className="mt-4 space-y-4 bg-gray-700 p-4 rounded-md">
            <div>
              <label className="block text-gray-300 mb-2">Mevcut Şifre</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Yeni Şifre</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
            </button>
          </form>
        )}

        {/* Hesap Sil Butonu */}
        <button 
          onClick={handleDeleteAccountToggle}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 w-full sm:w-auto m-2"
        >
          {showDeleteForm ? 'İptal Et' : 'Hesabı Sil'}
        </button>

        {/* Hesap Silme Formu */}
        {showDeleteForm && (
          <form onSubmit={submitDeleteAccount} className="mt-4 space-y-4 bg-red-900/20 p-4 rounded-md border border-red-600">
            <div className="text-red-400 text-sm mb-3">
              ⚠️ Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Şifrenizi Girin</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Hesabı silmek için şifrenizi girin"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Siliniyor...' : 'Hesabı Kalıcı Olarak Sil'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AccountSettings;
