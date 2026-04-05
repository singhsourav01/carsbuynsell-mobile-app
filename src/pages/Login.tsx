import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, AlertCircle } from 'lucide-react'
import axios from 'axios'
import type { AuthResponse } from '@/types'

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://13.127.188.130:3001'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [userDetails, setUserDetails] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post<AuthResponse>(`${AUTH_API_URL}/auth/signin`, {
        user_details: userDetails,
        password: password
      })

      const { data } = response.data

      // Check if user has ADMIN role
      if (data.user_role !== 'ADMIN') {
        setError('Access denied. Only administrators can access this panel.')
        setLoading(false)
        return
      }

      // Transform API user to app user format
      const user = {
        id: data.user_id,
        name: data.user_full_name,
        email: data.user_email,
        phone: data.user_primary_phone,
        status: 'accepted' as const,
        role: data.user_role,
        isVerified: data.user_email_verified && data.user_phone_verified,
        createdAt: data.user_created_at,
      }

      login(user, data.access_token, data.refresh_token)
      navigate('/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Invalid credentials. Please try again.'
        setError(message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Car className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">CarsBuyNSell Admin</CardTitle>
            <CardDescription>Sign in to your administrator account</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userDetails">Email or Phone</Label>
              <Input
                id="userDetails"
                type="text"
                placeholder="admin@gmail.com or phone number"
                value={userDetails}
                onChange={(e) => setUserDetails(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Admin access only. Contact system administrator for access.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
