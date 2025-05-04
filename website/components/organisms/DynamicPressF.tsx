'use client';

import dynamic from 'next/dynamic';

// Dynamically import the PressF component with client-side only rendering
const PressF = dynamic(() => import('./PressF').then(mod => mod.PressF), {
  ssr: false,
  loading: () => <ButtonPlaceholder />,
});

interface DynamicPressFProps {
  techId: string;
  techName: string;
}

// Placeholder component with same dimensions as the PressF button
function ButtonPlaceholder() {
  return (
    <div className="flex flex-col items-center mt-6 mb-10">
      <p className="text-zinc-400 text-sm mb-2">Press F to Pay Respects</p>
      <div className="w-24 h-24 bg-[#2c2c2c] rounded-lg border-2 border-black opacity-50 flex items-center justify-center">
        <span className="text-4xl font-bold text-zinc-600">F</span>
      </div>
      <div className="h-6 mt-2">{/* Space for respects counter */}</div>
      <div className="h-4 mt-1">{/* Space for personal respects */}</div>
    </div>
  );
}

/**
 * DynamicPressF - Dynamic import wrapper for the "Press F to Pay Respects" button
 * Uses dynamic loading to reduce initial bundle size.
 */
export function DynamicPressF({ techId, techName }: DynamicPressFProps) {
  return <PressF techId={techId} techName={techName} />;
}
