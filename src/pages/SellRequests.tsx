import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/StatusBadge'
import { mockSellRequests } from '@/types/mock-data'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { Eye, Check, X } from 'lucide-react'

type SellRequest = typeof mockSellRequests[0]

export default function SellRequests() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')

  const columns: ColumnDef<SellRequest>[] = [
    {
      accessorKey: 'title',
      header: 'Vehicle',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.images[0]}
            alt={row.original.title}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-gray-500">{row.original.category}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'userName',
      header: 'Seller',
    },
    {
      accessorKey: 'expectedPrice',
      header: 'Expected Price',
      cell: ({ row }) => `₹${row.original.expectedPrice.toLocaleString()}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted',
      cell: ({ row }) => dayjs(row.original.createdAt).format('DD MMM YYYY'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/sell-requests/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          {row.original.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-green-600"
                onClick={() => _handleApprove(row.original.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600"
                onClick={() => _handleReject(row.original.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  const _handleApprove = (_id: string) => {
    toast.success('Sell request approved and converted to listing')
  }

  const _handleReject = (_id: string) => {
    toast.error('Sell request rejected')
  }

  const statusFilters = ['All', 'pending', 'approved', 'rejected']

  const filteredRequests =
    filter === 'All'
      ? mockSellRequests
      : mockSellRequests.filter((r) => r.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Sell Requests</h1>
        <p className="text-gray-500">Review pending vehicle submissions</p>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredRequests}
        searchKey="title"
        searchPlaceholder="Search requests..."
      />
    </div>
  )
}
