
import React from 'react';

interface InputProps {
  label: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
}

const Input: React.FC<InputProps> = ({ label, type, value, onChange, placeholder, min }) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        placeholder={placeholder}
        className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-white text-black"
      />
    </div>
  );
};

export default Input;
