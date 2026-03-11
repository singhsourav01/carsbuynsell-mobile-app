import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { mockAuctions, mockUsers } from '@/types/mock-data'
import { toast } from 'sonner'
import { ArrowLeft, Pause, Play, Clock, Users, DollarSign, Gavel, Shield, AlertCircle } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function AuctionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const auction = mockAuctions.find(a => a.id === id)
  const seller = mockUsers.find(u => u.id === auction?.listing.sellerId)

  const [isActive, setIsActive] = useState(auction?.isActive ?? true)
  const [timeExtension, setTimeExtension] = useState('1')

  if (!auction) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500">Auction not found</p>
        <Button onClick={() => navigate('/auctions')} className="mt-4">
          Back to Auctions
        </Button>
      </div>
    )
  }

  const handleToggleStatus = () => {
    setIsActive(!isActive)
    toast.success(isActive ? 'Auction paused' : 'Auction resumed')
  }

  const handleEndAuction = () => {
    toast.success('Auction ended successfully')
    navigate('/auctions')
  }

  const handleExtendTime = () => {
    toast.success(`Auction extended by ${timeExtension} hour(s)`)
  }

  const mockBids = [
    { id: '1', bidder: 'Vikram S.', amount: auction.currentBid - 100000, time: '2 hours ago' },
    { id: '2', bidder: 'Priya M.', amount: auction.currentBid - 200000, time: '5 hours ago' },
    { id: '3', bidder: 'Amit K.', amount: auction.currentBid - 350000, time: '1 day ago' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/auctions')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-navy">Auction Details</h1>
        </div>
        <div className="flex gap-2">
          <Button variant={isActive ? 'outline' : 'default'} onClick={handleToggleStatus}>
            {isActive ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Resume</>}
          </Button>
          <Button variant="destructive" onClick={handleEndAuction}>
            End Auction
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="relative">
              <img
                src={auction.listing.images[0]}
                alt={auction.listing.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant={isActive ? 'active' : 'outline'}>
                  {isActive ? 'Live' : 'Paused'}
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold">{auction.listing.title}</h2>
              <p className="text-gray-500">{auction.listing.category} • {auction.listing.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-surface rounded-lg">
                <DollarSign className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-2xl font-bold">₹{auction.currentBid.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Current Bid</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <Users className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-2xl font-bold">{auction.bidCount}</p>
                <p className="text-sm text-gray-500">Total Bids</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <Clock className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-2xl font-bold">
                  {dayjs(auction.endsAt).diff(dayjs(), 'hour')}h
                </p>
                <p className="text-sm text-gray-500">Time Left</p>
              </div>
            </div>

            {isActive && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Auction ends {dayjs(auction.endsAt).fromNow()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" /> Time Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={timeExtension}
                  onChange={(e) => setTimeExtension(e.target.value)}
                  className="w-20"
                  min="1"
                  max="48"
                />
                <Button onClick={handleExtendTime}>Extend</Button>
              </div>
              <p className="text-sm text-gray-500">Extend auction by 1-48 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{seller?.name || auction.listing.sellerName}</p>
                  <p className="text-sm text-gray-500">Verified Seller</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Highest Bidder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{auction.highestBidder || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">Current highest bid</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Bid History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBids.map((bid, index) => (
                <div key={bid.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{bid.bidder}</p>
                      <p className="text-sm text-gray-500">{bid.time}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{bid.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
