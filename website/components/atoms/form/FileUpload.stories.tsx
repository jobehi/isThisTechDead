import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileUpload, FileUploadProps } from './FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'Atoms/Form/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

// Use a functional component for stories with state
const FileUploadWithState = (args: Partial<FileUploadProps>) => {
  const [hasFile, setHasFile] = useState(args.hasFile || false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasFile(e.target.files !== null && e.target.files.length > 0);
    if (args.onChange) {
      args.onChange(e);
    }
  };

  const handleClear = () => {
    setHasFile(false);
    if (args.onClear) {
      args.onClear();
    }
  };

  return (
    <FileUpload
      id={args.id || 'file-upload-id'}
      label={args.label || 'Upload File'}
      onChange={handleChange}
      onClear={handleClear}
      accept={args.accept}
      required={args.required}
      disabled={args.disabled}
      hasFile={hasFile}
      helperText={args.helperText}
      buttonText={args.buttonText}
      changeButtonText={args.changeButtonText}
    />
  );
};

export const Default: StoryObj<typeof FileUpload> = {
  render: args => <FileUploadWithState {...args} />,
  args: {
    id: 'default-upload',
    label: 'Profile Image',
  },
};

export const WithFile: StoryObj<typeof FileUpload> = {
  render: args => <FileUploadWithState {...args} />,
  args: {
    id: 'with-file-upload',
    label: 'Document Upload',
    hasFile: true,
  },
};

export const Required: StoryObj<typeof FileUpload> = {
  render: args => <FileUploadWithState {...args} />,
  args: {
    id: 'required-upload',
    label: 'Required Document',
    required: true,
  },
};

export const Disabled: StoryObj<typeof FileUpload> = {
  render: args => <FileUploadWithState {...args} />,
  args: {
    id: 'disabled-upload',
    label: 'Disabled Upload',
    disabled: true,
  },
};

export const WithHelperText: StoryObj<typeof FileUpload> = {
  render: args => <FileUploadWithState {...args} />,
  args: {
    id: 'helper-upload',
    label: 'Project Image',
    helperText: 'Maximum file size: 5MB. Supported formats: JPEG, PNG',
  },
};

export const CustomButtonText: StoryObj<typeof FileUpload> = {
  render: args => <FileUploadWithState {...args} />,
  args: {
    id: 'custom-text-upload',
    label: 'Custom Upload Button',
    buttonText: 'Select Image',
    changeButtonText: 'Replace Image',
  },
};

export const PDFOnly: StoryObj<typeof FileUpload> = {
  render: args => <FileUploadWithState {...args} />,
  args: {
    id: 'pdf-upload',
    label: 'PDF Document',
    accept: 'application/pdf',
    helperText: 'Please upload a PDF document',
  },
};
