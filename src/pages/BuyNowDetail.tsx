import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/services/api-client'
import { Listing } from '@/types/listing-types'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Eye, IndianRupee, Loader2, Tag, User } from 'lucide-react'

export default function BuyNowDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fromPage = searchParams.get('from') || '1'

  const [listing, setListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleBack = () => {
    navigate(`/buy-now?page=${fromPage}`)
  }

  useEffect(() => {
    const fetchBuyNowDetail = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get(`/user/admin/buy-now/${id}`)
        setListing(response.data?.data || null)
      } catch (error) {
        console.error('Failed to fetch buy now listing:', error)
        toast.error('Failed to load buy now listing details')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchBuyNowDetail()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500 mt-2">Loading buy now listing...</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500">Buy now listing not found</p>
        <Button onClick={handleBack} className="mt-4">
          Back to Buy Now
        </Button>
      </div>
    )
  }

  const images = listing.user_portfolio || []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-navy">Buy Now Details</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="relative">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex].file_signed_url}
                    alt={`${listing.lst_title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                  <Badge className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white">
                    {currentImageIndex + 1} / {images.length}
                  </Badge>
                </>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant="buy_now">Buy Now</Badge>
                <Badge variant={listing.lst_status?.toLowerCase() === 'active' ? 'active' : 'outline'}>
                  {listing.lst_status}
                </Badge>
                {listing.lst_is_featured && <Badge className="bg-amber-100 text-amber-700">Featured</Badge>}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={img.file_id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.file_signed_url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-2xl font-bold">{listing.lst_title}</h2>
              <p className="text-gray-500 mt-1">{listing.lst_description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {listing.category?.cat_name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {dayjs(listing.lst_created_at).format('DD MMM YYYY')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-surface rounded-lg">
                <IndianRupee className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-xl font-bold">₹{Number(listing.lst_price || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Fixed Price</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <Eye className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-xl font-bold">{listing.lst_view_count || 0}</p>
                <p className="text-sm text-gray-500">Views</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <Calendar className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-xl font-bold">{dayjs(listing.lst_updated_at).format('DD MMM')}</p>
                <p className="text-sm text-gray-500">Updated</p>
              </div>
            </div>

            {listing.vehicle_details && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Vehicle Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.vehicle_details.lvd_fuel_type && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Fuel Type</p>
                      <p className="font-medium">{listing.vehicle_details.lvd_fuel_type}</p>
                    </div>
                  )}
                  {listing.vehicle_details.lvd_transmission && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-medium">{listing.vehicle_details.lvd_transmission}</p>
                    </div>
                  )}
                  {listing.vehicle_details.lvd_body_type && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Body Type</p>
                      <p className="font-medium">{listing.vehicle_details.lvd_body_type}</p>
                    </div>
                  )}
                  {listing.vehicle_details.lvd_ownership && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Ownership</p>
                      <p className="font-medium">{listing.vehicle_details.lvd_ownership.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                  {listing.vehicle_details.lvd_year && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{listing.vehicle_details.lvd_year}</p>
                    </div>
                  )}
                  {listing.vehicle_details.lvd_kilometers && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Kilometers</p>
                      <p className="font-medium">{listing.vehicle_details.lvd_kilometers.toLocaleString()} km</p>
                    </div>
                  )}
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
                <span className="text-gray-500">Status</span>
                <span className="font-medium">{listing.lst_status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Created At</span>
                <span className="font-medium">{dayjs(listing.lst_created_at).format('DD MMM YYYY')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
