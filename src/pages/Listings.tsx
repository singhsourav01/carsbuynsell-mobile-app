import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/StatusBadge'
import ConfirmDialog from '@/components/ConfirmDialog'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { Eye, Pencil, Trash2, Plus, Loader2, Search, User as UserIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/services/api-client'
import { CreateListingPayload, Listing } from '@/types/listing-types'

const columns: ColumnDef<Listing>[] = [
  {
    accessorKey: 'lst_title',
    header: 'Listing',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.images && row.original.images[0] && row.original.images[0].limg_url ? (
          <img
            src={row.original.images[0].limg_url}
            alt={row.original.lst_title || 'Listing Image'}
            className="h-12 w-12 rounded-md object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div>
          <p className="font-medium text-navy">{row.original.lst_title || 'Untitled Listing'}</p>
          <p className="text-xs text-slate-500">{row.original.category?.cat_name || 'No Category'}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'lst_type',
    header: 'Type',
    cell: ({ row }) => <StatusBadge status={((row.original.lst_type || 'BUY_NOW').toLowerCase() as any)} />,
  },
  {
    accessorKey: 'lst_price',
    header: 'Price',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-navy">₹{Number(row.original.lst_price || 0).toLocaleString()}</p>
        {row.original.lst_current_bid && (
          <p className="text-xs text-slate-500">
            Bid: ₹{Number(row.original.lst_current_bid).toLocaleString()}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'lst_is_featured',
    header: 'Featured',
    cell: ({ row }) => row.original.lst_is_featured ? (
      <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
        Featured
      </span>
    ) : '-',
  },
  {
    accessorKey: 'lst_view_count',
    header: 'Views',
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-slate-500">
        <Eye className="h-3 w-3" />
        <span className="text-sm">{row.original.lst_view_count || 0}</span>
      </div>
    ),
  },
  {
    accessorKey: 'lst_created_at',
    header: 'Created',
    cell: ({ row }) => row.original.lst_created_at ? dayjs(row.original.lst_created_at).format('DD MMM YYYY') : 'N/A',
  },
]

export default function Listings() {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Real Data State
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoadingListings, setIsLoadingListings] = useState(true)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  // User Selection State
  const [userSearch, setUserSearch] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const [formData, setFormData] = useState<CreateListingPayload>({
    lst_title: '',
    lst_description: '',
    lst_category_id: '',
    lst_type: 'BUY_NOW',
    lst_price: 0,
    lst_auction_end: '',
    lst_min_increment: 0,
  })

  const [imageUrls, setImageUrls] = useState<string>('')

  const fetchListings = async () => {
    try {
      setIsLoadingListings(true)

      const response = await apiClient.get('http://localhost:8002/user/listings')

      const raw = response.data

      console.log(response.data, " here is response")

      const listingsArray =
        raw?.data?.data ||
        []

      setListings(Array.isArray(listingsArray) ? listingsArray : [])

    } catch (error) {
      console.error('Failed to fetch listings:', error)
      toast.error('Failed to load listings data')
    } finally {
      setIsLoadingListings(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true)
      const response = await apiClient.get('http://localhost:8002/user/categories')
      const data = response.data.data?.categories || response.data.data || []
      if (Array.isArray(data)) {
        setCategories(data.map((c: any) => ({
          id: c.cat_id || c.id,
          name: c.cat_name || c.name,
        })))
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoadingCategories(false)
    }
  }

  useEffect(() => {
    fetchListings()
    fetchCategories()
  }, [])

  const fetchUsers = async (search: string = '') => {
    try {
      setIsLoadingUsers(true)

      const url = search
        ? `http://localhost:8002/user/users?search=${search}`
        : `http://localhost:8002/user/users`

      const response = await apiClient.get(url)

      const raw = response.data

      const usersArray =
        raw?.data?.data ||
        raw?.data ||
        []

      setUsers(Array.isArray(usersArray) ? usersArray : [])

    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  // User Search Effect
  useEffect(() => {
    if (userSearch.length > 0 && userSearch.length < 2) return

    const timer = setTimeout(() => {
      if (userSearch.length >= 2) {
        fetchUsers(userSearch)
      } else if (userSearch.length === 0 && createOpen) {
        // If they clear the search, show all users again if dialog is open
        fetchUsers('')
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [userSearch, createOpen])

  const handleCreateListing = async () => {
    if (!selectedUser) {
      toast.error('Please select a seller first')
      return
    }
    if (!formData.lst_title || !formData.lst_category_id || !formData.lst_price) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.lst_type === 'AUCTION' && !formData.lst_auction_end) {
      toast.error('Auction end time is required for Auctions')
      return
    }

    try {
      setIsCreating(true)

      // 1. Create the listing with seller_id as param
      const createResponse = await apiClient.post(`http://localhost:8002/user/listings?seller_id=${selectedUser.user_id}`, formData)
      const listingId = createResponse.data.data?.lst_id || createResponse.data.data?.id

      if (!listingId) {
        throw new Error('Failed to get listing ID from response')
      }

      // 2. Add images if any
      if (imageUrls.trim()) {
        const urls = imageUrls.split('\n').map(u => u.trim()).filter(u => u)
        if (urls.length > 0) {
          await apiClient.post(`/user/listings/${listingId}/images`, { urls })
        }
      }

      toast.success('Listing created successfully! Status: DRAFT')
      setCreateOpen(false)
      // Reset form
      setFormData({
        lst_title: '',
        lst_description: '',
        lst_category_id: '',
        lst_type: 'BUY_NOW',
        lst_price: 0,
        lst_auction_end: '',
        lst_min_increment: 0,
      })
      setImageUrls('')
      setSelectedUser(null)
      setUserSearch('')
      setShowUserDropdown(false)
      fetchListings()
    } catch (error: any) {
      console.error('Error creating listing:', error)
      toast.error(error.response?.data?.message || 'Failed to create listing')
    } finally {
      setIsCreating(false)
    }
  }

  const filteredListings = listings.filter((listing) => {
    if (!listing) return false
    const typeMatch = typeFilter === 'All' || (listing.lst_type && listing.lst_type.toUpperCase() === typeFilter.toUpperCase())
    const statusMatch = statusFilter === 'All' ||
      (listing.lst_status && listing.lst_status.toLowerCase() === statusFilter.toLowerCase())
    return typeMatch && statusMatch
  })

  const actionColumns: ColumnDef<Listing>[] = [
    ...columns,
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/listings/${row.original.lst_id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate(`/listings/${row.original.lst_id}`)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600"
            onClick={() => {
              setSelectedListing(row.original)
              setDeleteOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const typeFilters = ['All', 'Auction', 'Buy_now']
  const statusFilters = ['All', 'Active', 'Sold', 'Expired', 'Draft']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Listings</h1>
          <p className="text-gray-500">Manage vehicle listings and auctions</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Listing</DialogTitle>
              <DialogDescription>
                Select a seller and add vehicle details. Status will be DRAFT.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* User Selection */}
              <div className="grid gap-2 relative">
                <Label htmlFor="user_search">Select Seller *</Label>
                <div className={`relative flex items-center min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring ${selectedUser ? 'border-primary bg-primary/5' : ''}`}>
                  <Search className="h-4 w-4 shrink-0 text-slate-400 mr-2" />

                  {selectedUser ? (
                    <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded border border-primary/20 shadow-sm animate-in fade-in zoom-in duration-200">
                      <UserIcon className="h-3 w-3 text-primary" />
                      <span className="font-medium text-primary text-xs">{selectedUser.user_full_name}</span>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <input
                      className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
                      placeholder="Search seller by name (e.g. sourav)"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onFocus={() => {
                        setShowUserDropdown(true)

                        if (users.length === 0) {
                          fetchUsers('')
                        }
                      }}
                      onBlur={() => setShowUserDropdown(false)}
                    />
                  )}

                  {isLoadingUsers && <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />}
                </div>

                {!selectedUser && showUserDropdown && (<div
                  className="absolute top-full left-0 right-0 z-[100] mt-1 bg-white border rounded-md shadow-lg max-h-[250px] overflow-y-auto"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {isLoadingUsers ? (
                    <div className="p-4 flex items-center justify-center text-slate-400">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Fetching users...</span>
                    </div>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <div
                        key={user.user_id}
                        className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b last:border-0"
                        onClick={() => {
                          setSelectedUser(user)
                          setUserSearch('')
                          setShowUserDropdown(false)
                          setUsers([])
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-navy leading-none mb-1">
                              {user.user_full_name || user.full_name || user.name || user.fullName || 'User ID: ' + user.user_id?.split('-')[0]}
                            </p>
                            <p className="text-xs text-slate-500">
                              {user.user_email || user.email || user.user_primary_phone || user.phone || 'No contact details'}
                            </p>
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-slate-300" />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-sm italic">
                      No users found
                    </div>
                  )}
                </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lst_title">Title *</Label>
                  <Input
                    id="lst_title"
                    placeholder="e.g., 2024 Hyundai Creta SX"
                    value={formData.lst_title}
                    onChange={(e) => setFormData({ ...formData, lst_title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lst_category_id">Category *</Label>
                  <Select
                    value={formData.lst_category_id}
                    onValueChange={(value) => setFormData({ ...formData, lst_category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lst_description">Description</Label>
                <Textarea
                  id="lst_description"
                  placeholder="Mint condition, single owner, 5000km driven..."
                  value={formData.lst_description}
                  onChange={(e) => setFormData({ ...formData, lst_description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lst_type">Listing Type *</Label>
                  <Select
                    value={formData.lst_type}
                    onValueChange={(value: 'BUY_NOW' | 'AUCTION') => setFormData({ ...formData, lst_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUY_NOW">Buy Now</SelectItem>
                      <SelectItem value="AUCTION">Auction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lst_price">
                    {formData.lst_type === 'AUCTION' ? 'Starting Price (₹) *' : 'Fixed Price (₹) *'}
                  </Label>
                  <Input
                    id="lst_price"
                    type="number"
                    placeholder="0"
                    value={formData.lst_price || ''}
                    onChange={(e) => setFormData({ ...formData, lst_price: Number(e.target.value) })}
                  />
                </div>
              </div>

              {formData.lst_type === 'AUCTION' && (
                <div className="grid grid-cols-2 gap-4 border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-md">
                  <div className="grid gap-2">
                    <Label htmlFor="lst_auction_end">Auction End Time *</Label>
                    <Input
                      id="lst_auction_end"
                      type="datetime-local"
                      value={formData.lst_auction_end}
                      onChange={(e) => setFormData({ ...formData, lst_auction_end: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lst_min_increment">Min Bid Increment (₹)</Label>
                    <Input
                      id="lst_min_increment"
                      type="number"
                      placeholder="e.g. 5000"
                      value={formData.lst_min_increment || ''}
                      onChange={(e) => setFormData({ ...formData, lst_min_increment: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="image_urls">Image URLs (one per line)</Label>
                <Textarea
                  id="image_urls"
                  placeholder="https://image1.jpg&#10;https://image2.jpg"
                  className="h-24"
                  value={imageUrls}
                  onChange={(e) => setImageUrls(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={isCreating}>
                Cancel
              </Button>
              <Button onClick={handleCreateListing} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : 'Create Listing'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {typeFilters.map((type) => (
              <SelectItem key={type} value={type}>
                {type === 'All' ? 'All Types' : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'All' ? 'All Status' : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoadingListings ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={actionColumns}
          data={filteredListings}
          searchKey="lst_title"
          searchPlaceholder="Search listings..."
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Listing"
        description={`Are you sure you want to delete "${selectedListing?.lst_title}"?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (selectedListing) {
            toast.success('Listing deleted successfully')
            setDeleteOpen(false)
          }
        }}
      />
    </div>
  )
}
