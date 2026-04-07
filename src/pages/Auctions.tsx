import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/services/api-client'
import { Auction } from '@/types/listing-types'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { Gavel, Clock, Users, ExternalLink, Loader2, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function AuctionCard({ auction, currentPage }: { auction: Auction; currentPage: number }) {
  const navigate = useNavigate()
  const endsAt = dayjs(auction.lst_auction_end)
  const now = dayjs()
  const hoursLeft = endsAt.diff(now, 'hour')
  const isEnded = endsAt.isBefore(now)
  const isEndingSoon = !isEnded && hoursLeft < 24

  const getTimeLeftText = () => {
    if (isEnded) return 'Ended'
    if (hoursLeft < 1) {
      const minutesLeft = endsAt.diff(now, 'minute')
      return `Ends in ${minutesLeft} min`
    }
    if (hoursLeft < 24) return `Ends in ${hoursLeft}h`
    const daysLeft = endsAt.diff(now, 'day')
    return `Ends in ${daysLeft}d`
  }
  
  const handleViewDetails = () => {
    navigate(`/auctions/${auction.lst_id}?from=${currentPage}`)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {auction.images && auction.images[0]?.limg_url ? (
            <img
              src={auction.images[0].limg_url}
              alt={auction.lst_title}
              className="h-24 w-24 rounded-lg object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{auction.lst_title}</h3>
                <p className="text-sm text-gray-500">{auction.category?.cat_name}</p>
              </div>
              <Badge variant={auction.lst_status === 'ACTIVE' && !isEnded ? 'active' : 'outline'}>
                {isEnded ? 'Ended' : auction.lst_status}
              </Badge>
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <div>
                <p className="text-gray-500">Current Bid</p>
                <p className="font-semibold">₹{Number(auction.lst_current_bid || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Bids</p>
                <p className="font-semibold">{auction._count?.bids || auction.lst_bid_count || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Views</p>
                <p className="font-semibold">{auction.lst_view_count || 0}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Clock className={`h-4 w-4 ${isEnded ? 'text-gray-400' : isEndingSoon ? 'text-red-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${isEnded ? 'text-gray-500' : isEndingSoon ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                {getTimeLeftText()}
              </span>
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

export default function Auctions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Get page from URL or default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    take: 10
  })

  const fetchAuctions = async (page: number = 1) => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(`/user/admin/auctions?page=${page}`)
      const data = response.data?.data
      
      setAuctions(data?.auctions || [])
      setPagination({
        count: data?.count || 0,
        page: data?.page || 1,
        take: data?.take || 10
      })
    } catch (error) {
      console.error('Failed to fetch auctions:', error)
      toast.error('Failed to load auctions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAuctions(currentPage)
  }, [currentPage])

  const totalPages = Math.ceil(pagination.count / pagination.take)
  const now = dayjs()
  
  const activeAuctions = auctions.filter(a => 
    a.lst_status === 'ACTIVE' && dayjs(a.lst_auction_end).isAfter(now)
  )
  const endingSoonAuctions = auctions.filter(a => 
    a.lst_status === 'ACTIVE' && 
    dayjs(a.lst_auction_end).isAfter(now) && 
    dayjs(a.lst_auction_end).diff(now, 'hour') < 24
  )
  const totalBids = auctions.reduce((acc, a) => acc + (a._count?.bids || a.lst_bid_count || 0), 0)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500 mt-2">Loading auctions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Auctions</h1>
          <p className="text-gray-500">Manage live and upcoming auctions</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">{activeAuctions.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">{totalBids}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Ending Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              <p className="text-2xl font-bold">{endingSoonAuctions.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Auctions ({pagination.count})</h2>
        </div>
        
        {auctions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Gavel className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No auctions found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {auctions.map((auction) => (
              <AuctionCard key={auction.lst_id} auction={auction} currentPage={currentPage} />
            ))}
          </div>
        )}

        {/* Pagination */}
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
