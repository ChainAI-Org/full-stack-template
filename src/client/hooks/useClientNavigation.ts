/**
 * A SSR-safe navigation function that works in both server and client environments.
 * Unlike useNavigate from React Router which can't be used during SSR, this function
 * is safe to use anywhere.
 * 
 * During server-side rendering, it becomes a no-op.
 * During client-side rendering, it uses the History API when possible to avoid full page reloads.
 */
export function useClientNavigation() {
  return (to: string, options?: { replace?: boolean }) => {
    // Server-side rendering - do nothing
    if (typeof window === 'undefined') {
      return;
    }

    // If we're in the browser and have access to history API
    // use it to preserve client-side router state
    try {
      // Use the pushState/replaceState API to stay within the SPA
      // This avoids making actual HTTP requests to server routes
      if (options?.replace) {
        window.history.replaceState(null, '', to);
      } else {
        window.history.pushState(null, '', to);
      }
      
      // Since pushState doesn't trigger router updates, we need to create
      // a popstate event to tell React Router the URL changed
      const navigationEvent = new PopStateEvent('popstate');
      window.dispatchEvent(navigationEvent);
    } catch (error) {
      // Fallback to standard location change if history API fails
      if (options?.replace) {
        window.location.replace(to);
      } else {
        window.location.href = to;
      }
    }
  };
}
