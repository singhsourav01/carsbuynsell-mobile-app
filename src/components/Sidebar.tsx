import { Link, useLocation } from 'react-router-dom'
import { useUIStore } from '@/store/ui-store'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Car,
  Gavel,
  FileText,
  Handshake,
  // CreditCard,
  // Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MODERATOR'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['ADMIN', 'MODERATOR'] },
  { name: 'Listings', href: '/listings', icon: Car, roles: ['ADMIN', 'MODERATOR'] },
  { name: 'Auctions', href: '/auctions', icon: Gavel, roles: ['ADMIN', 'MODERATOR'] },
  { name: 'Buy Now', href: '/buy-now', icon: FileText, roles: ['ADMIN', 'MODERATOR'] },
  { name: 'Vehicle Records', href: '/vehicle-record', icon: Handshake, roles: ['ADMIN', 'MODERATOR'] },
  // { name: 'Deals', href: '/deals', icon: Handshake, roles: ['ADMIN', 'MODERATOR'] },
  // { name: 'Categories', href: '/categories', icon: Tags, roles: ['ADMIN'] },
  // { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard, roles: ['ADMIN'] },
  // { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['ADMIN'] },
  // { name: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN', 'MODERATOR'] },
]

export default function Sidebar() {
  const location = useLocation()
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const user = useAuthStore((state) => state.user)

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-navy text-white transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!sidebarCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Car className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">CarsBuyNSell</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 hover:bg-white/10"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="mt-4 px-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1 transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
