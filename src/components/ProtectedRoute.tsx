import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  // Check if authenticated and user has ADMIN role
  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
