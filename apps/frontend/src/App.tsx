import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Subscriptions from './pages/Subscriptions.tsx';
import Analytics from './pages/Analytics.tsx';
import Settings from './pages/Settings.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Workaround for monorepo type conflicts
const QueryClientProviderAny = QueryClientProvider as any;
const BrowserRouterAny = BrowserRouter as any;
const RoutesAny = Routes as any;
const RouteAny = Route as any;
const NavigateAny = Navigate as any;
const ProtectedRouteAny = ProtectedRoute as any;
const LayoutAny = Layout as any;
const DashboardAny = Dashboard as any;
const SubscriptionsAny = Subscriptions as any;
const AnalyticsAny = Analytics as any;
const SettingsAny = Settings as any;
const LoginAny = Login as any;
const RegisterAny = Register as any;

function App() {
  return (
    <QueryClientProviderAny client={queryClient}>
      <BrowserRouterAny>
        <RoutesAny>
          {/* Public Routes */}
          <RouteAny path="/login" element={<LoginAny />} />
          <RouteAny path="/register" element={<RegisterAny />} />

          {/* Protected Routes */}
          <RouteAny element={<ProtectedRouteAny />}>
            <RouteAny path="/" element={<LayoutAny />}>
              <RouteAny index element={<NavigateAny to="/dashboard" replace />} />
              <RouteAny path="dashboard" element={<DashboardAny />} />
              <RouteAny path="subscriptions" element={<SubscriptionsAny />} />
              <RouteAny path="analytics" element={<AnalyticsAny />} />
              <RouteAny path="settings" element={<SettingsAny />} />
            </RouteAny>
          </RouteAny>

          {/* Fallback */}
          <RouteAny path="*" element={<NavigateAny to="/dashboard" replace />} />
        </RoutesAny>
      </BrowserRouterAny>
    </QueryClientProviderAny>
  );
}

export default App;
