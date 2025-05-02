import type { Meta, StoryObj } from '@storybook/react';
import { ReCaptchaTerms } from './ReCaptchaTerms';

const meta: Meta<typeof ReCaptchaTerms> = {
  title: 'Molecules/ReCaptchaTerms',
  component: ReCaptchaTerms,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#09090b',
        },
      ],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReCaptchaTerms>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: '20px' }}>
      <ReCaptchaTerms />
    </div>
  ),
};

export const InFormContext: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: '20px' }}>
      <form className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <div className="mb-4">
          <label className="block text-zinc-400 mb-2 text-sm">Email</label>
          <input
            type="email"
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-300"
            placeholder="your@email.com"
          />
        </div>
        <div className="mb-4">
          <button
            type="button"
            className="w-full bg-lime-700 hover:bg-lime-600 text-white py-2 rounded"
          >
            Submit
          </button>
        </div>
        <ReCaptchaTerms />
      </form>
    </div>
  ),
  name: 'In Form Context',
};
