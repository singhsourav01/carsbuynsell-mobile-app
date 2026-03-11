import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { mockUsers, mockListings, mockSubscriptions } from '@/types/mock-data'
import { toast } from 'sonner'
import { ArrowLeft, Edit, Save, Ban, Check, X, Car, CreditCard } from 'lucide-react'
import dayjs from 'dayjs'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  
  const user = mockUsers.find(u => u.id === id)
  const userListings = mockListings.filter(l => l.sellerId === id)
  const userSubscription = mockSubscriptions.find(s => s.userId === id)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500">User not found</p>
        <Button onClick={() => navigate('/users')} className="mt-4">
          Back to Users
        </Button>
      </div>
    )
  }

  const handleSave = () => {
    toast.success('User profile updated successfully')
    setIsEditing(false)
  }

  const handleStatusChange = (status: string) => {
    toast.success(`User status changed to ${status}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-navy">User Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:row-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="mt-2 flex gap-2">
                <Badge variant={user.status === 'accepted' ? 'accepted' : user.status === 'pending' ? 'pending' : user.status === 'blocked' ? 'blocked' : 'rejected'}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
                <Badge variant="outline">{user.role}</Badge>
              </div>
              {user.isVerified && (
                <Badge variant="success" className="mt-2">
                  <Check className="mr-1 h-3 w-3" /> Verified
                </Badge>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Member Since</span>
                <span className="font-medium">{dayjs(user.createdAt).format('DD MMM YYYY')}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium">Quick Actions</p>
              <div className="flex gap-2">
                {user.status === 'pending' && (
                  <>
                    <Button size="sm" className="flex-1" onClick={() => handleStatusChange('accepted')}>
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleStatusChange('rejected')}>
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </>
                )}
                {user.status === 'accepted' && (
                  <Button size="sm" variant="outline" className="w-full" onClick={() => handleStatusChange('blocked')}>
                    <Ban className="mr-1 h-4 w-4" /> Block User
                  </Button>
                )}
                {user.status === 'blocked' && (
                  <Button size="sm" className="w-full" onClick={() => handleStatusChange('accepted')}>
                    <Check className="mr-1 h-4 w-4" /> Unblock User
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Verified</p>
                <p className="text-sm text-gray-500">User has verified email</p>
              </div>
              <Switch checked={user.isVerified} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Phone Verified</p>
                <p className="text-sm text-gray-500">User has verified phone</p>
              </div>
              <Switch checked={user.isVerified} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Auth</p>
                <p className="text-sm text-gray-500">Enable 2FA for this user</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="h-5 w-5" /> User Listings ({userListings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userListings.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {userListings.map(listing => (
                  <div key={listing.id} className="flex gap-3 p-3 border rounded-lg">
                    <img src={listing.images[0]} alt={listing.title} className="h-16 w-16 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-sm text-gray-500">₹{listing.price.toLocaleString()}</p>
                      <Badge variant={listing.status === 'active' ? 'active' : 'sold'} className="mt-1">
                        {listing.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No listings yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userSubscription ? (
              <div className="space-y-2">
                <p className="font-medium">{userSubscription.planName} Plan</p>
                <p className="text-sm text-gray-500">
                  {userSubscription.listingsUsed}/{userSubscription.listingsTotal} listings used
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ width: `${(userSubscription.listingsUsed / userSubscription.listingsTotal) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Expires: {dayjs(userSubscription.expiresAt).format('DD MMM YYYY')}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No active subscription</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
