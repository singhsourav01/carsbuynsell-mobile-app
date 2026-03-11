import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockDeals, mockUsers, mockListings } from '@/types/mock-data'
import { toast } from 'sonner'
import { ArrowLeft, User, Car, CheckCircle, Clock, XCircle, FileText } from 'lucide-react'
import dayjs from 'dayjs'

export default function DealDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const deal = mockDeals.find(d => d.id === id)
  const buyer = mockUsers.find(u => u.id === deal?.buyerId)
  const seller = mockUsers.find(u => u.id === deal?.sellerId)
  const listing = mockListings.find(l => l.id === deal?.listingId)

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500">Deal not found</p>
        <Button onClick={() => navigate('/deals')} className="mt-4">
          Back to Deals
        </Button>
      </div>
    )
  }

  const statusConfig = {
    won: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Won' },
    pending_payment: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending Payment' },
    completed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Completed' },
    lost: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Lost' },
  }

  const status = statusConfig[deal.status]

  const timeline = [
    { status: 'Deal Created', date: deal.createdAt, completed: true },
    { status: 'Payment Received', date: deal.status === 'completed' || deal.status === 'won' ? deal.createdAt : null, completed: deal.status === 'completed' || deal.status === 'won' },
    { status: 'Vehicle Delivered', date: deal.status === 'completed' ? deal.createdAt : null, completed: deal.status === 'completed' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/deals')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-navy">Deal Details</h1>
        </div>
        {deal.status === 'pending_payment' && (
          <Button onClick={() => toast.success('Payment marked as received')}>
            Mark Payment Received
          </Button>
        )}
      </div>

      <div className={`p-6 rounded-lg ${status.bg}`}>
        <div className="flex items-center gap-3">
          <status.icon className={`h-8 w-8 ${status.color}`} />
          <div>
            <h2 className="text-xl font-bold">{deal.listingTitle}</h2>
            <p className="text-gray-600">{status.label}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Deal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-gray-500">Deal Type</span>
                  <Badge variant={deal.type === 'auction' ? 'auction' : 'buy_now'}>
                    {deal.type === 'auction' ? 'Auction' : 'Buy Now'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-gray-500">Final Price</span>
                  <span className="font-bold text-lg">₹{deal.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-gray-500">Platform Fee</span>
                  <span className="font-medium">₹{(deal.price * 0.02).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg bg-green-50">
                  <span className="text-gray-500 font-medium">Seller Receives</span>
                  <span className="font-bold text-lg text-green-600">₹{(deal.price * 0.98).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-gray-500">Created Date</span>
                  <span className="font-medium">{dayjs(deal.createdAt).format('DD MMM YYYY')}</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-gray-500">Deal ID</span>
                  <span className="font-mono text-sm">#{deal.id}</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-gray-500">Listing ID</span>
                  <span className="font-mono text-sm">#{deal.listingId}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-4">Transaction Timeline</h3>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`h-4 w-4 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <p className={`font-medium ${item.completed ? 'text-navy' : 'text-gray-500'}`}>
                        {item.status}
                      </p>
                      {item.date && (
                        <p className="text-sm text-gray-500">
                          {dayjs(item.date).format('DD MMM YYYY, h:mm A')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" /> Buyer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{buyer?.name || deal.buyerName}</p>
                  <p className="text-sm text-gray-500">{buyer?.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/users/${deal.buyerId}`)}>
                View Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="h-5 w-5" /> Seller
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{seller?.name || deal.sellerName}</p>
                  <p className="text-sm text-gray-500">{seller?.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/users/${deal.sellerId}`)}>
                View Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" /> Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent>
              {listing && (
                <div className="space-y-3">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium">{listing.title}</p>
                    <p className="text-sm text-gray-500">{listing.category}</p>
                  </div>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/listings/${deal.listingId}`)}>
                View Listing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
