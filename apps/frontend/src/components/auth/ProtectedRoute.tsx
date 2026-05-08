import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('auth_token');
  
  const NavigateAny = Navigate as any;
  const OutletAny = Outlet as any;

  if (!token) {
    return <NavigateAny to="/login" replace />;
  }

  return <OutletAny />;
}
