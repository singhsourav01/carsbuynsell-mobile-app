import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Car } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'Admin User',
        email,
        phone: '+91 9876543210',
        status: 'accepted' as const,
        role: email.includes('admin') ? 'admin' as const : 'moderator' as const,
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
      
      login(mockUser, 'mock-token', 'mock-refresh-token')
      setLoading(false)
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Car className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">AutoBid Admin</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@autobid.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          <p className="mt-4 text-center text-sm text-gray-500">
            Use any email to sign in (use 'admin' for admin role)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
