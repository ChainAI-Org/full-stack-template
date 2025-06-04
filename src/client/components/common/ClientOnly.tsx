import * as React from 'react';
import { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only renders its children on the client side
 * This prevents hydration mismatches and errors with components 
 * that can't be properly server-rendered (like react-router components)
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  // Start with hasMounted = false during SSR
  const [hasMounted, setHasMounted] = useState(false);
  
  // After client-side hydration, set hasMounted to true
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  // During SSR and initial client render before hydration, render nothing (or fallback)
  if (!hasMounted) {
    return <>{fallback}</>;
  }
  
  // Only render the actual content on the client after hydration is complete
  return <>{children}</>;
}
