import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockAuctions } from '@/types/mock-data'
import dayjs from 'dayjs'
import { Gavel, Clock, Users, ExternalLink, Plus, Pause, StopCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Auction = typeof mockAuctions[0]

function AuctionCard({ auction }: { auction: Auction }) {
  const navigate = useNavigate()
  const endsIn = dayjs(auction.endsAt).diff(dayjs(), 'hour')
  const isEndingSoon = endsIn < 24

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={auction.listing.images[0]}
            alt={auction.listing.title}
            className="h-24 w-24 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{auction.listing.title}</h3>
                <p className="text-sm text-gray-500">{auction.listing.category}</p>
              </div>
              <Badge variant={auction.isActive ? 'active' : 'outline'}>
                {auction.isActive ? 'Live' : 'Ended'}
              </Badge>
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <div>
                <p className="text-gray-500">Current Bid</p>
                <p className="font-semibold">₹{auction.currentBid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Bids</p>
                <p className="font-semibold">{auction.bidCount}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Clock className={`h-4 w-4 ${isEndingSoon ? 'text-red-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${isEndingSoon ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                {endsIn > 0 ? `Ends in ${endsIn} hours` : 'Ended'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/auctions/${auction.id}`)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </Button>
          {auction.isActive && (
            <>
              <Button variant="outline" size="sm">
                <Pause className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-red-600">
                <StopCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Auctions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Auctions</h1>
          <p className="text-gray-500">Manage live and upcoming auctions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Auction
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">
                {mockAuctions.filter((a) => a.isActive).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Bids Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">
                {mockAuctions.reduce((acc, a) => acc + a.bidCount, 0)}
              </p>
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
              <p className="text-2xl font-bold">
                {
                  mockAuctions.filter(
                    (a) => a.isActive && dayjs(a.endsAt).diff(dayjs(), 'hour') < 24
                  ).length
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Live Auctions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </div>
    </div>
  )
}
