'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly wrapper component
 *
 * Ensures content is only rendered on the client to prevent hydration mismatches
 * with dynamic content such as Math.random(), new Date(), etc.
 *
 * @example
 * ```tsx
 * <ClientOnly>
 *   <div>Current time: {new Date().toLocaleTimeString()}</div>
 * </ClientOnly>
 * ```
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
