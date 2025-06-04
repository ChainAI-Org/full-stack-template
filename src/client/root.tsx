import * as React from 'react'
const { Suspense, useState, useEffect } = React
import { Routes, Route } from 'react-router'
import { Router, AppRoute } from '$app/core.tsx'
import { AuthProvider } from './context/AuthContext'
import { Login } from './components/auth/Login'
import { Signup } from './components/auth/Signup'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Header } from './components/layout/Header'

// Simple component that prevents React Router from rendering during SSR
// This avoids hydration mismatches with React Router
function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return mounted ? children : <div className="min-h-screen bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center py-16">
        <div className="animate-pulse rounded-md bg-blue-100 p-4 mb-4 inline-block">
          <div className="h-8 w-28 bg-blue-200 rounded"></div>
        </div>
        <p className="text-gray-600">Loading application...</p>
      </div>
    </div>
  </div>
}

export default function Root ({ url, routes, head, ctxHydration, routeMap }) {
  return (
    <AuthProvider>
      <Suspense>
        <ClientOnly>
          <Router location={url}>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Map the existing routes from the framework */}
                  {routes.map(({ path, component: Component }) => {
                    // Determine if the route should be protected
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
                        } />
                    );
                  })}
                </Routes>
              </main>
            </div>
          </Router>
        </ClientOnly>
      </Suspense>
    </AuthProvider>
  )
}
