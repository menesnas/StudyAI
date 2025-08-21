import React from 'react';

/**
 * Authentication formları için özelleştirilmiş buton bileşeni
 * @param {Object} props - Buton props'ları
 */
function AuthButton({ 
  children, 
  type = 'button', 
  loading = false, 
  variant = 'primary',
  className = '',
  ...otherProps 
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-blue-600 text-white hover:bg-blue-700 
          focus:ring-4 focus:ring-blue-500/30
          disabled:bg-blue-400 disabled:cursor-not-allowed
        `;
      case 'secondary':
        return `
          bg-gray-600 text-white hover:bg-gray-700 
          focus:ring-4 focus:ring-gray-500/30
          disabled:bg-gray-400 disabled:cursor-not-allowed
        `;
      default:
        return `
          bg-blue-600 text-white hover:bg-blue-700 
          focus:ring-4 focus:ring-blue-500/30
          disabled:bg-blue-400 disabled:cursor-not-allowed
        `;
    }
  };

  const baseClasses = `
    w-full py-3 px-4 rounded-md font-medium
    transition-all duration-200 
    focus:outline-none
    flex items-center justify-center
    ${getVariantClasses()}
  `;

  return (
    <button
      type={type}
      disabled={loading}
      className={`${baseClasses} ${className}`.trim()}
      {...otherProps}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          İşleniyor...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default AuthButton;
