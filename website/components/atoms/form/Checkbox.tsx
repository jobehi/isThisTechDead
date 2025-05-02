'use client';

import React from 'react';

export interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  helperText?: string | undefined;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
  helperText,
}) => (
  <div className="flex items-start">
    <div className="flex items-center h-5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 border-zinc-800 rounded bg-zinc-950 text-lime-500 focus:ring-lime-500 focus:ring-offset-zinc-950"
        disabled={disabled}
        required={required}
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor={id} className="text-zinc-300 font-medium cursor-pointer">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {helperText && <p className="text-xs text-zinc-500 mt-1">{helperText}</p>}
    </div>
  </div>
);
