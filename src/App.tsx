import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { queryClient } from '@/services/queryClient';
import { LocaleProvider, AuthProvider } from '@/contexts';
import { ProtectedRoute } from '@/components/common';
import { Spinner } from '@/components/ui/spinner';

// i18n initialization
import '@/i18n';

// Lazy load pages for better bundle optimization (bundle-dynamic-imports)
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const IncidentListPage = lazy(() => import('@/pages/IncidentListPage'));
const CreateIncidentPage = lazy(() => import('@/pages/CreateIncidentPage'));
const IncidentDetailsPage = lazy(() => import('@/pages/IncidentDetailsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AppLayout = lazy(() => import('@/components/layout/AppLayout'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />

                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/incidents" element={<IncidentListPage />} />
                      <Route
                        path="/incidents/new"
                        element={<CreateIncidentPage />}
                      />
                      <Route
                        path="/incidents/:id"
                        element={<IncidentDetailsPage />}
                      />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                  </Route>

                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

export default App;
