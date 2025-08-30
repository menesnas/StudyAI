import axios from 'axios';
import { API_BASE_URL } from './config';

/**
 * Kullanıcı girişi yapar
 * @param {Object} userData - Kullanıcı giriş bilgileri
 * @returns {Promise} API yanıtı
 */
export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/login`, 
    userData
  );
  
  if (response.data && response.data.token) {
    // Token'ı kontrol et
    console.log('Received token:', response.data.token.substring(0, 10) + '...');
    
    // LocalStorage'a kaydet
    localStorage.setItem('user', JSON.stringify(response.data));
    
    // Doğrulama için tekrar oku
    const stored = localStorage.getItem('user');
    console.log('Stored user data:', stored ? 'exists' : 'missing');
  }
  
  return response.data;
};

/**
 * Yeni kullanıcı kaydı yapar
 * @param {Object} userData - Kullanıcı kayıt bilgileri
 * @returns {Promise} API yanıtı
 */
export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/register`, 
    userData
  );
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

/**
 * Kullanıcı çıkışı yapar
 */
export const logoutUser = () => {
  localStorage.removeItem('user');
};

/**
 * Kullanıcı profil bilgilerini getirir
 * @param {string} userId - Kullanıcı ID'si
 * @param {Object} token - JWT token
 * @returns {Promise} API yanıtı
 */
export const getUserProfile = async (userId, token) => {
  const response = await axios.get(
    `${API_BASE_URL}/users/${userId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Kullanıcı şifresini değiştirir
 * @param {Object} passwordData - Şifre değiştirme bilgileri
 * @returns {Promise} API yanıtı
 */
export const changePassword = async (passwordData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.token) {
    throw new Error('Kullanıcı girişi yapılmamış');
  }

  const response = await axios.put(
    `${API_BASE_URL}/users/change-password`,
    passwordData,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );
  return response.data;
};

/**
 * Kullanıcı hesabını siler
 * @param {string} password - Kullanıcının şifresi
 * @returns {Promise} API yanıtı
 */
export const deleteAccount = async (password) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.token) {
    throw new Error('Kullanıcı girişi yapılmamış');
  }

  const response = await axios.delete(
    `${API_BASE_URL}/users/delete-account`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      data: { password }
    }
  );
  
  // Hesap silindikten sonra localStorage'ı temizle
  localStorage.removeItem('user');
  
  return response.data;
};