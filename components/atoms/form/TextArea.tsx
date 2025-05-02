'use client';

import React from 'react';

export interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  rows?: number | undefined;
  helperText?: string | undefined;
}

export const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  rows = 3,
  helperText,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-lime-500 focus:border-lime-500 disabled:opacity-50"
      disabled={disabled}
      required={required}
    />
    {helperText && <p className="mt-1 text-xs text-zinc-500">{helperText}</p>}
  </div>
);
