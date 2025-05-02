import type { Preview } from '@storybook/react';
import '../app/globals.css'; // Include your global CSS with Tailwind
import { Geist, Geist_Mono } from 'next/font/google';
import React, { useEffect } from 'react';

// Load Geist fonts (same as production)
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Set dark mode directly on the document
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
  document.body.classList.add('bg-zinc-950');
}

// Dark mode wrapper component
const DarkModeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
    return () => {
      root.classList.remove('dark');
      root.style.colorScheme = '';
    };
  }, []);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} font-sans bg-zinc-950 text-zinc-100 min-h-screen`}
    >
      {children}
    </div>
  );
};

// Component wrapper with correct styling
const ComponentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="p-8 rounded-md bg-zinc-950 text-zinc-100 min-h-[200px] min-w-[200px]">
    {children}
  </div>
);

// Wrap stories with your font providers and theme context
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#09090b', // zinc-950
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
    layout: 'centered',
    // Force dark mode for all stories
    darkMode: {
      current: 'dark',
      darkClass: 'dark',
      stylePreview: true,
      classTarget: 'html',
    },
    themes: {
      default: 'dark',
      clearable: false,
    },
  },
  decorators: [
    Story => (
      <DarkModeWrapper>
        <ComponentWrapper>
          <Story />
        </ComponentWrapper>
      </DarkModeWrapper>
    ),
  ],
};

export default preview;
