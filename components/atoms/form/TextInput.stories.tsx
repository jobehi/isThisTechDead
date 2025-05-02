import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextInput, TextInputProps } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Atoms/Form/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

// Use a functional component for stories with state
const TextInputWithState = (args: Partial<TextInputProps>) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <TextInput
      id={args.id || 'input-id'}
      label={args.label || 'Label'}
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={args.placeholder}
      required={args.required}
      disabled={args.disabled}
      type={args.type}
    />
  );
};

export const Default: StoryObj<typeof TextInput> = {
  render: args => <TextInputWithState {...args} />,
  args: {
    id: 'default-input',
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

export const Password: StoryObj<typeof TextInput> = {
  render: args => <TextInputWithState {...args} />,
  args: {
    id: 'password-input',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Required: StoryObj<typeof TextInput> = {
  render: args => <TextInputWithState {...args} />,
  args: {
    id: 'required-input',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
};

export const Disabled: StoryObj<typeof TextInput> = {
  render: args => <TextInputWithState {...args} />,
  args: {
    id: 'disabled-input',
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
    value: 'Cannot change this value',
  },
};

export const Email: StoryObj<typeof TextInput> = {
  render: args => <TextInputWithState {...args} />,
  args: {
    id: 'email-input',
    label: 'Email Address',
    type: 'email',
    placeholder: 'example@example.com',
  },
};

export const Number: StoryObj<typeof TextInput> = {
  render: args => <TextInputWithState {...args} />,
  args: {
    id: 'number-input',
    label: 'Age',
    type: 'number',
    placeholder: 'Enter your age',
  },
};
