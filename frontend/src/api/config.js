export const API_BASE_URL = 'http://localhost:5000/api';

/**
 * API istekleri için yetkilendirme header'ı oluşturur
 * @returns {Object} Header yapılandırması
 */
export const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user && user.token) {
    return {
      Authorization: `Bearer ${user.token}`,
    };
  }
  
  return {};
};

/**
 * Tüm API istekleri için kullanılacak temel yapılandırma
 * @returns {Object} API yapılandırması
 */
export const getRequestConfig = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  };
};