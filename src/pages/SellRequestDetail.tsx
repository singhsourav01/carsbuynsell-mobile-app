import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { mockSellRequests, mockUsers } from '@/types/mock-data'
import { toast } from 'sonner'
import { ArrowLeft, Check, X, User, DollarSign, Calendar, FileText, Car } from 'lucide-react'
import dayjs from 'dayjs'

export default function SellRequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  
  const request = mockSellRequests.find(r => r.id === id)
  const user = mockUsers.find(u => u.id === request?.userId)

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500">Sell request not found</p>
        <Button onClick={() => navigate('/sell-requests')} className="mt-4">
          Back to Sell Requests
        </Button>
      </div>
    )
  }

  const handleApprove = () => {
    toast.success('Sell request approved and converted to listing')
    navigate('/sell-requests')
  }

  const handleReject = () => {
    toast.error('Sell request rejected')
    setShowRejectDialog(false)
    navigate('/sell-requests')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/sell-requests')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-navy">Sell Request Details</h1>
        </div>
        {request.status === 'pending' && (
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
              <Check className="mr-2 h-4 w-4" /> Approve
            </Button>
            <Button variant="destructive" onClick={() => setShowRejectDialog(true)}>
              <X className="mr-2 h-4 w-4" /> Reject
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="relative">
              <img
                src={request.images[0]}
                alt={request.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge variant={request.status === 'pending' ? 'pending' : request.status === 'approved' ? 'accepted' : 'rejected'}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold">{request.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-gray-500">
                <span className="flex items-center gap-1">
                  <Car className="h-4 w-4" /> {request.category}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" /> ₹{request.expectedPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{request.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-surface rounded-lg">
                <DollarSign className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-xl font-bold">₹{request.expectedPrice.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Expected Price</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <Calendar className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-xl font-bold">{dayjs(request.createdAt).format('DD MMM')}</p>
                <p className="text-sm text-gray-500">Submitted</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <FileText className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-xl font-bold">{request.images.length}</p>
                <p className="text-sm text-gray-500">Images</p>
              </div>
            </div>

            {request.status === 'rejected' && request.rejectionReason && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-700">Rejection Reason</h4>
                <p className="text-red-600 mt-1">{request.rejectionReason}</p>
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
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.name || request.userName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-500">{user?.phone}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/users/${request.userId}`)}>
                View Full Profile
              </Button>
            </CardContent>
          </Card>

          {request.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={handleApprove}>
                  <Check className="mr-2 h-4 w-4" /> Approve & Create Listing
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate(`/listings`)}>
                  Edit Before Listing
                </Button>
              </CardContent>
            </Card>
          )}

          {showRejectDialog && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reject Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rejection Reason</Label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowRejectDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleReject}>
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
