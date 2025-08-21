import React from 'react';
import AuthLayout from '../components/AuthLayout';
import RegisterForm from '../components/RegisterForm';

/**
 * Register sayfası - sadece sayfa düzeninden sorumlu
 * Tüm form mantığı RegisterForm bileşenine taşındı
 */
function RegisterPage() {
  return (
    <AuthLayout title="Yeni Hesap Oluşturun">
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;