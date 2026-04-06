import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Edit, Save, Trash2, DollarSign, Calendar, User, Tag, Loader2 } from 'lucide-react'
import dayjs from 'dayjs'
import { apiClient } from '@/services/api-client'
import { Listing } from '@/types/listing-types'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [listing, setListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    price: 0,
    status: '',
  })

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get(`/user/listings/${id}`)
        const data = response.data?.data || response.data
        setListing(data)
        setFormData({
          title: data.lst_title || '',
          description: data.lst_description || '',
          category: data.category?.cat_name || '',
          type: data.lst_type || '',
          price: Number(data.lst_price) || 0,
          status: data.lst_status || '',
        })
      } catch (error) {
        console.error('Failed to fetch listing:', error)
        toast.error('Failed to load listing')
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchListing()
  }, [id])

  // Toggle featured status
  const handleToggleFeatured = async () => {
    if (!listing) return
    try {
      setIsTogglingFeatured(true)
      const newFeaturedStatus = !listing.lst_is_featured
      
      await apiClient.patch(`/admin/listings/${listing.lst_id}/feature`, {
        is_featured: newFeaturedStatus
      })
      
      setListing(prev => prev ? { ...prev, lst_is_featured: newFeaturedStatus } : null)
      toast.success(newFeaturedStatus ? 'Listing marked as featured' : 'Listing unfeatured')
    } catch (error: any) {
      console.error('Error toggling featured status:', error)
      toast.error(error.response?.data?.message || 'Failed to update featured status')
    } finally {
      setIsTogglingFeatured(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500 mt-2">Loading listing...</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500">Listing not found</p>
        <Button onClick={() => navigate('/listings')} className="mt-4">
          Back to Listings
        </Button>
      </div>
    )
  }

  const handleSave = () => {
    toast.success('Listing updated successfully')
    setIsEditing(false)
  }

  const handleDelete = () => {
    toast.success('Listing deleted')
    navigate('/listings')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/listings')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-navy">Listing Details</h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy_now">Buy Now</SelectItem>
                        <SelectItem value="auction">Auction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  {listing.images && listing.images[0]?.limg_url ? (
                    <img
                      src={listing.images[0].limg_url}
                      alt={listing.lst_title}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant={listing.lst_type === 'AUCTION' ? 'auction' : 'buy_now'}>
                      {listing.lst_type === 'AUCTION' ? 'Auction' : 'Buy Now'}
                    </Badge>
                    <Badge variant={listing.lst_status?.toLowerCase() === 'active' ? 'active' : listing.lst_status?.toLowerCase() === 'sold' ? 'sold' : 'outline'}>
                      {listing.lst_status}
                    </Badge>
                    {listing.lst_is_featured && (
                      <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold">{listing.lst_title}</h2>
                  <p className="text-gray-500 mt-2">{listing.lst_description}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Tag className="h-4 w-4" />
                    <span>{listing.category?.cat_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <DollarSign className="h-4 w-4" />
                    <span>₹{Number(listing.lst_price).toLocaleString()}</span>
                  </div>
                  {listing.lst_current_bid && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>Current Bid: ₹{Number(listing.lst_current_bid).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Created {dayjs(listing.lst_created_at).format('DD MMM YYYY')}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{listing.seller?.user_full_name || 'Unknown Seller'}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/users/${listing.lst_seller_id}`)}>
                View Seller Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Listing Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Views</span>
                <span className="font-medium">{listing.lst_view_count || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Bids</span>
                <span className="font-medium">{listing.lst_bid_count || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Featured Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Featured Listing</p>
                  <p className="text-sm text-gray-500">Show on homepage</p>
                </div>
                {isTogglingFeatured ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <Switch 
                    checked={listing.lst_is_featured} 
                    onCheckedChange={handleToggleFeatured}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
