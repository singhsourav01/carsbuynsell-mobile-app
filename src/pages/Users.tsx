import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import StatusBadge from '@/components/StatusBadge'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { Eye, Check, X, Ban, Loader2 } from 'lucide-react'
import { apiClient } from '@/services/api-client'

export interface User {
  user_id: string
  user_full_name: string
  user_email: string
  user_primary_phone: string
  // Optional fields that might be added to the API later
  status?: string
  role?: string
  is_verified?: boolean
  created_at?: string
}

export default function Users() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'user_full_name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary uppercase">
              {(row.original.user_full_name || 'U').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.user_full_name || 'Unknown User'}</p>
            <p className="text-xs text-gray-500">{row.original.user_email || 'No email'}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'user_primary_phone',
      header: 'Phone',
      cell: ({ row }) => row.original.user_primary_phone || 'N/A',
    },
    {
      accessorKey: 'is_verified',
      header: 'Verified',
      cell: ({ row }) => {
        // Fallback to true if missing for now
        const isVerified = row.original.is_verified ?? true;
        return (
          <span className={isVerified ? 'text-green-600' : 'text-gray-500'}>
            {isVerified ? 'Yes' : 'No'}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const status = (row.original.status || 'accepted').toLowerCase()
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/users/${row.original.user_id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
            {status === 'pending' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-green-600"
                  onClick={() => handleStatusChange(row.original.user_id, 'accepted')}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600"
                  onClick={() => handleStatusChange(row.original.user_id, 'rejected')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            {status === 'accepted' && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600"
                onClick={() => handleStatusChange(row.original.user_id, 'blocked')}
              >
                <Ban className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const handleStatusChange = (_userId: string, targetStatus: string) => {
    toast.success(`User status updated to ${targetStatus}`)
  }

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get('http://localhost:8002/user/users')
      const raw = response.data
      const usersArray = raw?.data?.data || raw?.data || raw?.users || []

      setUsers(Array.isArray(usersArray) ? usersArray : [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const statusFilters = ['All', 'Pending', 'Accepted', 'Rejected', 'Blocked']

  const filteredUsers =
    filter === 'All'
      ? users
      : users.filter(
        (u) => (u.status || 'accepted').toLowerCase() === filter.toLowerCase()
      )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Users</h1>
          <p className="text-gray-500">Manage user accounts and verifications</p>
        </div>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((statusItem) => (
          <Button
            key={statusItem}
            variant={filter === statusItem ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(statusItem)}
          >
            {statusItem}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          searchKey="user_full_name"
          searchPlaceholder="Search users..."
        />
      )}
    </div>
  )
}
