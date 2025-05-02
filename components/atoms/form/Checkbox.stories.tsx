import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, CheckboxProps } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

// Use a functional component for stories with state
const CheckboxWithState = (args: Partial<CheckboxProps>) => {
  const [checked, setChecked] = useState(args.checked || false);
  return (
    <Checkbox
      id={args.id || 'checkbox-id'}
      label={args.label || 'Label'}
      checked={checked}
      onChange={e => setChecked(e.target.checked)}
      required={args.required}
      disabled={args.disabled}
      helperText={args.helperText}
    />
  );
};

export const Default: StoryObj<typeof Checkbox> = {
  render: args => <CheckboxWithState {...args} />,
  args: {
    id: 'default-checkbox',
    label: 'Accept terms and conditions',
  },
};

export const Checked: StoryObj<typeof Checkbox> = {
  render: args => <CheckboxWithState {...args} />,
  args: {
    id: 'checked-checkbox',
    label: 'Subscribed to newsletter',
    checked: true,
  },
};

export const Required: StoryObj<typeof Checkbox> = {
  render: args => <CheckboxWithState {...args} />,
  args: {
    id: 'required-checkbox',
    label: 'I agree to the privacy policy',
    required: true,
  },
};

export const Disabled: StoryObj<typeof Checkbox> = {
  render: args => <CheckboxWithState {...args} />,
  args: {
    id: 'disabled-checkbox',
    label: 'Disabled option',
    disabled: true,
  },
};

export const WithHelperText: StoryObj<typeof Checkbox> = {
  render: args => <CheckboxWithState {...args} />,
  args: {
    id: 'helper-checkbox',
    label: 'Receive promotional emails',
    helperText: 'You can unsubscribe at any time',
  },
};

export const DisabledChecked: StoryObj<typeof Checkbox> = {
  render: args => <CheckboxWithState {...args} />,
  args: {
    id: 'disabled-checked-checkbox',
    label: 'Completed step (cannot be changed)',
    disabled: true,
    checked: true,
  },
};
