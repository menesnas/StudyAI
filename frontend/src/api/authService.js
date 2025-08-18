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
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
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