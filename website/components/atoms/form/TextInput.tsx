'use client';

import React from 'react';

export interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  type?: React.HTMLInputTypeAttribute | undefined;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  type = 'text',
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-lime-500 focus:border-lime-500 disabled:opacity-50"
      disabled={disabled}
      required={required}
    />
  </div>
);
