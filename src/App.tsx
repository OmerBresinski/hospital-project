import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { queryClient } from '@/services/queryClient';
import { LocaleProvider, AuthProvider } from '@/contexts';
import { ProtectedRoute } from '@/components/common';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { IncidentListPage } from '@/pages/IncidentListPage';
import { CreateIncidentPage } from '@/pages/CreateIncidentPage';
import { IncidentDetailsPage } from '@/pages/IncidentDetailsPage';
import { SettingsPage } from '@/pages/SettingsPage';

// i18n initialization
import '@/i18n';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/incidents" element={<IncidentListPage />} />
                    <Route path="/incidents/new" element={<CreateIncidentPage />} />
                    <Route path="/incidents/:id" element={<IncidentDetailsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

export default App;
