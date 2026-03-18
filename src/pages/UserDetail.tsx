import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowLeft, Edit, Save, Loader2, User, Phone, Mail, Calendar, Ruler, Users } from 'lucide-react'
import { apiClient } from '@/services/api-client'

interface UserData {
  user_id: string
  user_full_name: string
  user_email: string
  user_gender: string | null
  user_dob: string | null
  user_height: string | null
  user_bio: string | null
  user_role: string
  user_primary_country_id: string | null
  user_primary_phone: string
  user_admin_status: string
  user_profile_image_file_id: string | null
  user_selfie_file_id: string | null
  is_private_user: boolean
  user_portfolio: string[]
}

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)

  const [formData, setFormData] = useState({
    user_full_name: '',
    user_email: '',
    user_primary_phone: '',
    user_gender: '',
    user_bio: '',
    user_admin_status: '',
  })

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(`http://13.127.188.130:3002/user/users/${id}`)
      const userData = response.data?.data
      if (userData) {
        setUser(userData)
        setFormData({
          user_full_name: userData.user_full_name || '',
          user_email: userData.user_email || '',
          user_primary_phone: userData.user_primary_phone || '',
          user_gender: userData.user_gender || '',
          user_bio: userData.user_bio || '',
          user_admin_status: userData.user_admin_status || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      toast.error('Failed to load user details')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchUser()
    }
  }, [id])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await apiClient.put('http://13.127.188.130:3002/user/users/users-profile', {
        user_id: id,
        ...formData,
      })
      toast.success('User profile updated successfully')
      setIsEditing(false)
      fetchUser()
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error('Failed to update user profile')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'REJECTED':
        return 'destructive'
      case 'BLOCKED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-navy">User Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Profile Card */}
        <Card className="lg:row-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {(user.user_full_name || 'U').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">{user.user_full_name || 'Unknown User'}</h2>
              <p className="text-gray-500">{user.user_email || 'No email'}</p>
              <div className="mt-2 flex gap-2">
                <Badge variant={getStatusBadgeVariant(user.user_admin_status)}>
                  {user.user_admin_status || 'Unknown'}
                </Badge>
                <Badge variant="outline">{user.user_role || 'USER'}</Badge>
              </div>
              {user.is_private_user && (
                <Badge variant="secondary" className="mt-2">
                  Private Account
                </Badge>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.user_primary_phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.user_email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{user.user_gender || 'Not specified'}</p>
                </div>
              </div>
              {user.user_dob && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{user.user_dob}</p>
                  </div>
                </div>
              )}
              {user.user_height && (
                <div className="flex items-center gap-3">
                  <Ruler className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">{user.user_height}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Edit Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" /> Profile Information
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={formData.user_full_name}
                      onChange={(e) => setFormData({ ...formData, user_full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.user_email}
                      onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.user_primary_phone}
                      onChange={(e) => setFormData({ ...formData, user_primary_phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={formData.user_gender}
                      onValueChange={(value) => setFormData({ ...formData, user_gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Admin Status</Label>
                    <Select
                      value={formData.user_admin_status}
                      onValueChange={(value) => setFormData({ ...formData, user_admin_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.user_bio}
                    onChange={(e) => setFormData({ ...formData, user_bio: e.target.value })}
                    placeholder="User bio..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-gray-500">Full Name</Label>
                  <p className="font-medium">{user.user_full_name || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{user.user_email || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Phone</Label>
                  <p className="font-medium">{user.user_primary_phone || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Gender</Label>
                  <p className="font-medium">{user.user_gender || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Admin Status</Label>
                  <p className="font-medium">{user.user_admin_status || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Role</Label>
                  <p className="font-medium">{user.user_role || 'USER'}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-gray-500">Bio</Label>
                  <p className="font-medium">{user.user_bio || 'No bio provided'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-mono text-sm mt-1 break-all">{user.user_id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Private Account</p>
                <p className="font-medium mt-1">{user.is_private_user ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Portfolio Items</p>
                <p className="font-medium mt-1">{user.user_portfolio?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
