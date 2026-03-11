import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole } from '@/types'

interface RoleRouteProps {
  allowedRoles: UserRole[]
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
