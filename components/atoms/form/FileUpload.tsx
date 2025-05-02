'use client';

import React, { useRef } from 'react';
import { UploadIcon } from '../icons/UploadIcon';
import { XIcon } from '../icons/XIcon';
import { linkButtonVariants } from '@/lib/ui/variants';
import { cn } from '@/lib/cn';

export interface FileUploadProps {
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: (() => void) | undefined;
  accept?: string | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  hasFile?: boolean | undefined;
  helperText?: string | undefined;
  buttonText?: string | undefined;
  changeButtonText?: string | undefined;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  onChange,
  onClear,
  accept = 'image/*',
  required = false,
  disabled = false,
  hasFile = false,
  helperText,
  buttonText = 'Upload File',
  changeButtonText = 'Change File',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 flex items-center">
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={onChange}
          className="sr-only"
          disabled={disabled}
          required={required}
        />
        <label
          htmlFor={id}
          className={cn(
            linkButtonVariants({
              variant: 'default',
              size: 'md',
              withIcon: 'left',
            }),
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <UploadIcon className="mr-2 h-5 w-5" />
          {hasFile ? changeButtonText : buttonText}
        </label>
        {hasFile && onClear && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'ml-3 text-zinc-500 hover:text-zinc-400',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
          >
            <XIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      {helperText && <p className="mt-1 text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};
