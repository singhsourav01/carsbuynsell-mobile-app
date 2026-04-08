import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/services/api-client'
import { Listing } from '@/types/listing-types'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { Badge } from '@/components/ui/badge'
import { Eye, ExternalLink, IndianRupee, Loader2, ChevronLeft, ChevronRight, Car, Users } from 'lucide-react'

function BuyNowCard({ listing, currentPage }: { listing: Listing; currentPage: number }) {
  const navigate = useNavigate()

  const firstImage = listing.user_portfolio?.[0]?.file_signed_url || listing.images?.[0]?.limg_url

  const handleViewDetails = () => {
    navigate(`/buy-now/${listing.lst_id}?from=${currentPage}`)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {firstImage ? (
            <img src={firstImage} alt={listing.lst_title} className="h-24 w-24 rounded-lg object-cover" />
          ) : (
            <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{listing.lst_title}</h3>
                <p className="text-sm text-gray-500">{listing.category?.cat_name || 'No Category'}</p>
              </div>
              <Badge variant={listing.lst_status?.toLowerCase() === 'active' ? 'active' : 'outline'}>
                {listing.lst_status}
              </Badge>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm">
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-semibold">₹{Number(listing.lst_price || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Views</p>
                <p className="font-semibold">{listing.lst_view_count || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-semibold">{dayjs(listing.lst_created_at).format('DD MMM')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleViewDetails}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BuyNow() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [buyNowListings, setBuyNowListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    take: 10,
  })

  const fetchBuyNowListings = async (page: number = 1) => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(`/user/admin/buy-now?page=${page}`)
      const data = response.data?.data

      setBuyNowListings(data?.buy_now_listings || [])
      setPagination({
        count: data?.count || 0,
        page: data?.page || 1,
        take: data?.take || 10,
      })
    } catch (error) {
      console.error('Failed to fetch buy now listings:', error)
      toast.error('Failed to load buy now listings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBuyNowListings(currentPage)
  }, [currentPage])

  const totalPages = Math.ceil(pagination.count / pagination.take)
  const activeCount = buyNowListings.filter((listing) => listing.lst_status === 'ACTIVE').length
  const totalViews = buyNowListings.reduce((acc, listing) => acc + (listing.lst_view_count || 0), 0)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500 mt-2">Loading buy now listings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Buy Now</h1>
          <p className="text-gray-500">Manage buy now listings</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">{totalViews}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">{pagination.count}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Buy Now Listings ({pagination.count})</h2>
        </div>

        {buyNowListings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <IndianRupee className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No buy now listings found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {buyNowListings.map((listing) => (
              <BuyNowCard key={listing.lst_id} listing={listing} currentPage={currentPage} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchParams({ page: String(Math.max(1, currentPage - 1)) })}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-500 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchParams({ page: String(Math.min(totalPages, currentPage + 1)) })}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
