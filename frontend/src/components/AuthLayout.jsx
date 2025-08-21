import React from 'react';

/**
 * Authentication sayfaları için ortak layout bileşeni
 * @param {Object} props - Bileşen props'ları
 * @param {React.ReactNode} props.children - İçerik
 * @param {string} props.title - Sayfa başlığı
 */
function AuthLayout({ children, title }) {
  return (
    <div 
      className="min-h-screen w-full bg-gray-900 p-4"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw'
      }}
    >
      <div 
        className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8"
        style={{ maxWidth: '28rem' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">StudyAI</h1>
          <h2 className="text-xl font-semibold text-gray-300">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
