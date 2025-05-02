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
      className={`${geistSans.variable} ${geistMono.variable} font-sans bg-zinc-950 text-zinc-100`}
      style={{ maxHeight: '400px' }}
    >
      {children}
    </div>
  );
};

// Component wrapper with correct styling
const ComponentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '16px',
      backgroundColor: 'transparent',
      color: 'rgb(244, 244, 245)',
      overflow: 'visible',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxHeight: '300px',
    }}
  >
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
    // Improve layout settings to reduce empty space
    layout: {
      centered: true,
      padded: true,
      fullscreen: false,
    },
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
    // Add viewport controls
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '400px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '400px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1024px',
            height: '400px',
          },
        },
      },
      defaultViewport: 'desktop',
    },
    // Force reasonable canvas size
    docs: {
      canvas: {
        withToolbar: true,
        className: 'fixed-height-canvas',
      },
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
