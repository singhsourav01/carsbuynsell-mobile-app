import { Outlet } from 'react-router-dom'
import { useUIStore } from '@/store/ui-store'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export default function AdminLayout() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
