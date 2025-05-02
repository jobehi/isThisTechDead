'use client';

import dynamic from 'next/dynamic';

// Dynamically import the PressF component with client-side only rendering
const PressF = dynamic(() => import('./PressF').then(mod => mod.PressF), {
  ssr: false,
});

interface DynamicPressFProps {
  techId: string;
  techName: string;
}

/**
 * DynamicPressF - Dynamic import wrapper for the "Press F to Pay Respects" button
 * Uses dynamic loading to reduce initial bundle size.
 */
export function DynamicPressF({ techId, techName }: DynamicPressFProps) {
  return <PressF techId={techId} techName={techName} />;
}
