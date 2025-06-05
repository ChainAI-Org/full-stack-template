import * as React from 'react';
import { Link as ReactRouterLink, type LinkProps as ReactRouterLinkProps } from 'react-router';

// Define our props type, extending React Router's LinkProps but ensuring our 'to' prop flexibility
// Omit 'to' from ReactRouterLinkProps to redefine it with our specific type.
// Include other LinkProps like 'reloadDocument', 'replace', 'state', 'preventScrollReset'.
interface ClientLinkProps extends Omit<ReactRouterLinkProps, 'to'> {
  to: string | { pathname: string; search?: string; hash?: string };
  children: React.ReactNode;
  // Allow any other props to be passed through, e.g., aria-attributes
  [key: string]: any;
}

/**
 * ClientLink component that wraps react-router-dom's Link component.
 * This aims to provide a consistent Link component that works correctly
 * with the project's SSR setup.
 */
export function ClientLink(props: ClientLinkProps) {
  const { to, children, ...rest } = props;

  // The 'to' prop for ReactRouterLink can be a string or a Partial<Path>
  // Our 'to' prop type is compatible.
  return (
    <ReactRouterLink to={to} {...rest}>
      {children}
    </ReactRouterLink>
  );
}
