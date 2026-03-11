import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/StatusBadge'
import { mockDeals } from '@/types/mock-data'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Eye } from 'lucide-react'

type Deal = typeof mockDeals[0]

export default function Deals() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')

  const columns: ColumnDef<Deal>[] = [
    {
      accessorKey: 'listingTitle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.listingTitle}</p>
          <p className="text-xs text-gray-500">{row.original.type === 'auction' ? 'Auction' : 'Buy Now'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'buyerName',
      header: 'Buyer',
    },
    {
      accessorKey: 'sellerName',
      header: 'Seller',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => `₹${row.original.price.toLocaleString()}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => dayjs(row.original.createdAt).format('DD MMM YYYY'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => navigate(`/deals/${row.original.id}`)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const statusFilters = ['All', 'won', 'pending_payment', 'completed', 'lost']

  const filteredDeals =
    filter === 'All'
      ? mockDeals
      : mockDeals.filter((d) => d.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Deals</h1>
        <p className="text-gray-500">Track all transactions and deals</p>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === 'All' ? 'All' : status === 'won' ? 'Won' : status === 'pending_payment' ? 'Pending Payment' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredDeals}
        searchKey="listingTitle"
        searchPlaceholder="Search deals..."
      />
    </div>
  )
}
