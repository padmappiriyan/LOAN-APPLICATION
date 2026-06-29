import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/10 rounded-xl',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10 rounded-xl',
    dark: 'bg-zinc-950 hover:bg-zinc-900 text-white shadow-md rounded-xl',
    outline: 'border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xl',
    ghost: 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg',
  };

  const sizes = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base',
    icon: 'p-1.5',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
};

export default Button;
