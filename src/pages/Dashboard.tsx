import { useState, useEffect } from 'react'
import { Users, Car, Gavel, Loader2 } from 'lucide-react'
import StatCard from '@/components/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/DataTable'
import StatusBadge from '@/components/StatusBadge'
import { ColumnDef } from '@tanstack/react-table'
import { apiClient } from '@/services/api-client'
import { toast } from 'sonner'

interface DashboardStats {
  totalUsers: number
  activeListings: number
  liveAuctions: number
  monthlyRevenue: number
  pendingApprovals: number
  dealsThisWeek: number
}

interface DashboardData {
  stats: DashboardStats
  recentSells: any[]
}

const sellRequestsColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'listing.lst_title',
    header: 'Title',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.listing?.lst_title || 'N/A'}</p>
        <p className="text-xs text-gray-500">{row.original.listing?.category?.cat_name || 'N/A'}</p>
      </div>
    ),
  },
  {
    accessorKey: 'listing.seller.user_full_name',
    header: 'Seller',
    cell: ({ row }) => row.original.listing?.seller?.user_full_name || 'N/A',
  },
  {
    accessorKey: 'listing.lst_price',
    header: 'Expected Price',
    cell: ({ row }) => {
      const price = row.original.listing?.lst_price
      return price ? `₹${Number(price).toLocaleString()}` : 'N/A'
    },
  },
  {
    accessorKey: 'ord_status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.ord_status} />,
  },
]

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Using the full URL as provided by the user to ensure it works regardless of baseURL config
        const response = await apiClient.get('http://13.127.188.130:3002/user/admin/dashboard')
        if (response.data.success) {
          setData(response.data.data)
        } else {
          toast.error(response.data.message || 'Failed to fetch dashboard data')
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('An error occurred while fetching dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const stats = data?.stats

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers.toLocaleString() || '0'}
          icon={Users}
        />
        <StatCard
          title="Active Listings"
          value={stats?.activeListings || 0}
          icon={Car}
        />
        <StatCard
          title="Live Auctions"
          value={stats?.liveAuctions || 0}
          icon={Gavel}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Sell Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentSells && data.recentSells.length > 0 ? (
              <DataTable
                columns={sellRequestsColumns}
                data={data.recentSells}
                searchKey="listing.lst_title"
                searchPlaceholder="Search requests..."
              />
            ) : (
              <div className="flex h-[200px] items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-gray-500 font-medium">no recent selling found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
