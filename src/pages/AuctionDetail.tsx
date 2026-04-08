import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/services/api-client'
import { AuctionDetail as AuctionDetailType } from '@/types/listing-types'
import { toast } from 'sonner'
import { ArrowLeft, Clock, Users, IndianRupee, Gavel, User, Eye, Tag, Calendar, Loader2, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function AuctionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fromPage = searchParams.get('from') || '1'
  
  const [auction, setAuction] = useState<AuctionDetailType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleBack = () => {
    navigate(`/auctions?page=${fromPage}`)
  }

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get(`/user/admin/auctions/${id}`)
        setAuction(response.data?.data)
      } catch (error) {
        console.error('Failed to fetch auction:', error)
        toast.error('Failed to load auction details')
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchAuction()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500 mt-2">Loading auction details...</p>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500">Auction not found</p>
        <Button onClick={handleBack} className="mt-4">
          Back to Auctions
        </Button>
      </div>
    )
  }

  // Get images from user_portfolio
  const images = (auction as any).user_portfolio || []
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const endsAt = dayjs(auction.lst_auction_end)
  const now = dayjs()
  const isEnded = endsAt.isBefore(now)
  const hoursLeft = endsAt.diff(now, 'hour')
  const isEndingSoon = !isEnded && hoursLeft < 24

  const getTimeLeftText = () => {
    if (isEnded) return 'Auction Ended'
    if (hoursLeft < 1) {
      const minutesLeft = endsAt.diff(now, 'minute')
      return `${minutesLeft} minutes left`
    }
    if (hoursLeft < 24) return `${hoursLeft} hours left`
    const daysLeft = endsAt.diff(now, 'day')
    return `${daysLeft} days left`
  }

  // Get highest bidder
  const highestBid = auction.bids && auction.bids.length > 0 ? auction.bids[0] : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-navy">Auction Details</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main auction info */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            {/* Image Slider */}
            <div className="relative">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex].file_signed_url}
                    alt={`${auction.lst_title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {/* Navigation Arrows */}
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
                  {/* Image Counter Badge */}
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
                <Badge variant={auction.lst_status === 'ACTIVE' && !isEnded ? 'active' : 'outline'}>
                  {isEnded ? 'Ended' : auction.lst_status}
                </Badge>
                {auction.lst_is_featured && (
                  <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img: any, index: number) => (
                  <button
                    key={img.file_id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.file_signed_url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-2xl font-bold">{auction.lst_title}</h2>
              <p className="text-gray-500 mt-1">{auction.lst_description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {auction.category?.cat_name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {dayjs(auction.lst_created_at).format('DD MMM YYYY')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-surface rounded-lg">
                <IndianRupee className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-xl font-bold">₹{Number(auction.lst_current_bid || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Current Bid</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <IndianRupee className="h-5 w-5 mx-auto text-gray-400" />
                <p className="mt-2 text-xl font-bold">₹{Number(auction.lst_price || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Starting Price</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <Users className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-xl font-bold">{auction.total_participants || 0}</p>
                <p className="text-sm text-gray-500">Participants</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <Gavel className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-xl font-bold">{auction.total_bids || 0}</p>
                <p className="text-sm text-gray-500">Total Bids</p>
              </div>
            </div>

            {/* Time status */}
            <div className={`mt-6 p-4 rounded-lg ${isEnded ? 'bg-gray-50 border border-gray-200' : isEndingSoon ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
              <div className={`flex items-center gap-2 ${isEnded ? 'text-gray-700' : isEndingSoon ? 'text-red-700' : 'text-amber-700'}`}>
                <Clock className="h-5 w-5" />
                <span className="font-medium">{getTimeLeftText()}</span>
                <span className="text-sm ml-2">
                  (Ends: {endsAt.format('DD MMM YYYY, hh:mm A')})
                </span>
              </div>
            </div>

            {/* Vehicle Details */}
            {auction.vehicle_details && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Vehicle Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {auction.vehicle_details.lvd_fuel_type && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Fuel Type</p>
                      <p className="font-medium">{auction.vehicle_details.lvd_fuel_type}</p>
                    </div>
                  )}
                  {auction.vehicle_details.lvd_transmission && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-medium">{auction.vehicle_details.lvd_transmission}</p>
                    </div>
                  )}
                  {auction.vehicle_details.lvd_body_type && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Body Type</p>
                      <p className="font-medium">{auction.vehicle_details.lvd_body_type}</p>
                    </div>
                  )}
                  {auction.vehicle_details.lvd_ownership && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Ownership</p>
                      <p className="font-medium">{auction.vehicle_details.lvd_ownership.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                  {auction.vehicle_details.lvd_year && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{auction.vehicle_details.lvd_year}</p>
                    </div>
                  )}
                  {auction.vehicle_details.lvd_kilometers && (
                    <div className="p-3 bg-surface rounded-lg">
                      <p className="text-sm text-gray-500">Kilometers</p>
                      <p className="font-medium">{auction.vehicle_details.lvd_kilometers.toLocaleString()} km</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {highestBid && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-green-600" />
                  Highest Bidder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{highestBid.bidder.user_full_name}</p>
                    <p className="text-sm text-green-600 font-semibold">
                      ₹{Number(highestBid.bid_amount).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {highestBid.bidder.user_email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {highestBid.bidder.user_primary_phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Auction Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Min Increment</span>
                <span className="font-medium">₹{Number(auction.lst_min_increment || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Views</span>
                <span className="font-medium flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {auction.lst_view_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Bids</span>
                <span className="font-medium">{auction.total_bids || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Participants</span>
                <span className="font-medium">{auction.total_participants || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participants Section */}
        {auction.participants && auction.participants.length > 0 && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants ({auction.total_participants})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Participant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Highest Bid</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Total Bids</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auction.participants.map((participant, index) => (
                      <tr key={participant.user.user_id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${index === 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100'} font-medium text-sm`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">{participant.user.user_full_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{participant.user.user_email}</td>
                        <td className="py-3 px-4 text-gray-500">{participant.user.user_primary_phone}</td>
                        <td className="py-3 px-4">
                          <Badge variant={participant.engagement_status === 'ACTIVE' ? 'active' : 'outline'}>
                            {participant.engagement_status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold">₹{participant.highest_bid.toLocaleString()}</td>
                        <td className="py-3 px-4">{participant.total_bids}</td>
                        <td className="py-3 px-4 text-gray-500">{dayjs(participant.joined_at).format('DD MMM, hh:mm A')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bid History */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Bid History ({auction.total_bids})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auction.bids && auction.bids.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">#</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Bidder</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Bid Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auction.bids.map((bid, index) => (
                      <tr key={bid.bid_id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${index === 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100'} font-medium text-sm`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{bid.bidder.user_full_name}</td>
                        <td className="py-3 px-4 text-gray-500">{bid.bidder.user_email}</td>
                        <td className="py-3 px-4 text-gray-500">{bid.bidder.user_primary_phone}</td>
                        <td className={`py-3 px-4 font-semibold ${index === 0 ? 'text-green-600' : ''}`}>
                          ₹{Number(bid.bid_amount).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm">{dayjs(bid.bid_created_at).format('DD MMM, hh:mm A')}</p>
                            <p className="text-xs text-gray-400">{dayjs(bid.bid_created_at).fromNow()}</p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Gavel className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No bids yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Engagements */}
        {auction.engagements && auction.engagements.length > 0 && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Engagements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {auction.engagements.map((engagement) => (
                  <div key={engagement.eng_id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{engagement.user.user_full_name}</span>
                      <Badge variant={engagement.eng_status === 'ACTIVE' ? 'active' : 'outline'}>
                        {engagement.eng_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{engagement.user.user_email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Joined: {dayjs(engagement.eng_created_at).format('DD MMM YYYY, hh:mm A')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
