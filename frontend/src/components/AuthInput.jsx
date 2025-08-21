import React from 'react';

/**
 * Authentication formları için özelleştirilmiş input bileşeni
 * @param {Object} props - Input props'ları
 */
function AuthInput({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = true,
  className = '',
  ...otherProps 
}) {
  const baseClasses = `
    w-full p-3 border border-gray-600 rounded-md 
    bg-gray-700 text-white placeholder-gray-400 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
    focus:outline-none transition-all duration-200
    hover:border-gray-500
  `;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`${baseClasses} ${className}`.trim()}
      {...otherProps}
    />
  );
}

export default AuthInput;
