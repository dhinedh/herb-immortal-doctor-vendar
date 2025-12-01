import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#1F2933] mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 border rounded-lg text-[#1F2933] placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-[#6CCF93] focus:border-transparent
          ${error ? 'border-[#E53935]' : 'border-[#E5E7EB]'} ${className}`}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-[#E53935]">{error}</p>
      )}
    </div>
  );
};
