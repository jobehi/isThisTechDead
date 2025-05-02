import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextArea, TextAreaProps } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Atoms/Form/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

// Use a functional component for stories with state
const TextAreaWithState = (args: Partial<TextAreaProps>) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <TextArea
      id={args.id || 'textarea-id'}
      label={args.label || 'Label'}
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={args.placeholder}
      required={args.required}
      disabled={args.disabled}
      rows={args.rows}
      helperText={args.helperText}
    />
  );
};

export const Default: StoryObj<typeof TextArea> = {
  render: args => <TextAreaWithState {...args} />,
  args: {
    id: 'default-textarea',
    label: 'Description',
    placeholder: 'Enter a description',
  },
};

export const WithHelperText: StoryObj<typeof TextArea> = {
  render: args => <TextAreaWithState {...args} />,
  args: {
    id: 'helper-textarea',
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    helperText: 'Maximum 200 characters',
  },
};

export const Required: StoryObj<typeof TextArea> = {
  render: args => <TextAreaWithState {...args} />,
  args: {
    id: 'required-textarea',
    label: 'Feedback',
    placeholder: 'Please provide your feedback',
    required: true,
  },
};

export const Disabled: StoryObj<typeof TextArea> = {
  render: args => <TextAreaWithState {...args} />,
  args: {
    id: 'disabled-textarea',
    label: 'Readonly Content',
    value: 'This content cannot be modified',
    disabled: true,
  },
};

export const LargeTextArea: StoryObj<typeof TextArea> = {
  render: args => <TextAreaWithState {...args} />,
  args: {
    id: 'large-textarea',
    label: 'Project Details',
    placeholder: 'Enter detailed project requirements',
    rows: 6,
  },
};
