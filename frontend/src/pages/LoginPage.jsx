import React from 'react';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

/**
 * Login sayfası - sadece sayfa düzeninden sorumlu
 * Tüm form mantığı LoginForm bileşenine taşındı
 */
function LoginPage() {
  return (
    <AuthLayout title="Hesabınıza Giriş Yapın">
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;