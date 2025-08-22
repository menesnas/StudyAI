import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../redux/features/auth/authSlice';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';

/**
 * Login formu bileşeni - sadece form mantığından sorumlu
 */
function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return;
    }
    dispatch(login(formData));
  };

  const isFormValid = formData.email && formData.password;

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
            autoComplete="current-password"
          />
        </div>
      </div>

      {/* Giriş Butonu */}
      <AuthButton
        type="submit"
        loading={loading}
        variant="primary"
        className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
      >
        Giriş Yap
      </AuthButton>

      {/* Kayıt Link'i */}
      <div className="text-center pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          Hesabınız yok mu?{' '}
          <Link 
            to="/register" 
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            Kayıt Olun
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;

