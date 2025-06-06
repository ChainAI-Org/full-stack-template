import * as React from 'react';
import './base.css'; // Import global styles including Tailwind
const { Suspense } = React
import { Routes, Route } from 'react-router';
import { Router, AppRoute } from '$app/core.tsx'
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Login } from './components/auth/Login'
import { Signup } from './components/auth/Signup'
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';

function AppContent({ url, routes, head, ctxHydration, routeMap }: any) {
  // This inner component is needed so useTheme can access the context from ThemeProvider

  return (
    <div className={`min-h-screen flex flex-col bg-brand-light-bg dark:bg-brand-dark-bg text-brand-light-text-primary dark:text-brand-dark-text-primary transition-colors duration-subtle`}>
      <Router location={url}>
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Map the existing routes from the framework */}
            {routes.map(({ path, component: Component }: any) => {
              const needsAuth = path === '/tasks';
              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    <AppRoute
                      head={head}
                      ctxHydration={ctxHydration}
                      ctx={routeMap[path]}>
                      {needsAuth ? (
                        <ProtectedRoute>
                          <Component />
                        </ProtectedRoute>
                      ) : (
                        <Component />
                      )}
                    </AppRoute>
                  }
                />
              );
            })}
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default function Root (props: any) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Suspense>
          <AppContent {...props} />
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  );
}
