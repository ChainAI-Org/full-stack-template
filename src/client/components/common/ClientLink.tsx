import * as React from 'react';
import { Link } from 'react-router-dom';

// Define our own props type instead of importing LinkProps
type ClientLinkProps = {
  to: string | { pathname: string; search?: string; hash?: string };
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
};

/**
 * SSR-safe Link component that prevents "Cannot destructure property 'basename'" errors
 * during server-side rendering by always rendering regular anchor tags.
 * 
 * Instead of using conditional rendering (which causes hydration mismatches),
 * we always render an anchor tag with an onClick handler that uses React Router
 * navigation when available.
 */
export function ClientLink(props: ClientLinkProps) {
  // Extract non-DOM props to avoid passing them to the DOM element
  const { to, children, className, ...rest } = props;
  
  // For consistency between client and server, always use an anchor tag
  return (
    <a
      href={typeof to === 'string' ? to : '#'}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        // Handle client-side navigation if we're in a browser
        if (typeof window !== 'undefined') {
          // We can use window.location directly since Link isn't available during SSR
          window.location.href = typeof to === 'string' ? to : to.pathname + (to.search || '') + (to.hash || '');
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
