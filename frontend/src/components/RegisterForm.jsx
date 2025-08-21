import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../redux/features/auth/authSlice';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';

/**
 * Register formu bileşeni - sadece kayıt form mantığından sorumlu
 */
function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  // Kullanıcı başarıyla kaydolduğunda dashboard'a yönlendir
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }
    dispatch(register(formData));
  };

  const isFormValid = 
    formData.username && 
    formData.email && 
    formData.firstName && 
    formData.lastName && 
    formData.password;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Form Alanları */}
      <div className="space-y-4">
        {/* Kullanıcı Adı */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
            Kullanıcı Adı
          </label>
          <AuthInput
            id="username"
            type="text"
            placeholder="kullaniciadi"
            value={formData.username}
            onChange={handleInputChange('username')}
            autoComplete="username"
          />
        </div>

        {/* İsim ve Soyisim - Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
              Ad
            </label>
            <AuthInput
              id="firstName"
              type="text"
              placeholder="Adınız"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              autoComplete="given-name"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
              Soyad
            </label>
            <AuthInput
              id="lastName"
              type="text"
              placeholder="Soyadınız"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              autoComplete="family-name"
            />
          </div>
        </div>

        {/* E-posta */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            E-posta Adresi
          </label>
          <AuthInput
            id="email"
            type="email"
            placeholder="ornek@email.com"
            value={formData.email}
            onChange={handleInputChange('email')}
            autoComplete="email"
          />
        </div>

        {/* Şifre */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Şifre
          </label>
          <AuthInput
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange('password')}
            autoComplete="new-password"
          />
          <p className="text-xs text-gray-400 mt-1">
            Şifreniz en az 6 karakter olmalıdır.
          </p>
        </div>
      </div>

      {/* Kayıt Butonu */}
      <AuthButton
        type="submit"
        loading={loading}
        variant="primary"
        className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
      >
        Kayıt Ol
      </AuthButton>

      {/* Giriş Link'i */}
      <div className="text-center pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          Zaten hesabınız var mı?{' '}
          <Link 
            to="/login" 
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            Giriş Yapın
          </Link>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;
