import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { mockSubscriptionPlans, mockSubscriptions } from '@/types/mock-data'
import { toast } from 'sonner'
import { Check, CreditCard, Edit } from 'lucide-react'

export default function Subscriptions() {
  const [plans, setPlans] = useState(mockSubscriptionPlans)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [editListings, setEditListings] = useState('')

  const openEdit = (plan: typeof plans[0]) => {
    setSelectedPlan(plan)
    setEditPrice(String(plan.price))
    setEditListings(String(plan.listings))
    setEditOpen(true)
  }

  const handleEdit = () => {
    if (selectedPlan) {
      setPlans(
        plans.map((p) =>
          p.id === selectedPlan.id
            ? { ...p, price: Number(editPrice), listings: Number(editListings) }
            : p
        )
      )
      toast.success('Plan updated successfully')
      setEditOpen(false)
    }
  }

  const togglePlanActive = (planId: string) => {
    setPlans(
      plans.map((p) =>
        p.id === planId ? { ...p, isActive: !p.isActive } : p
      )
    )
    toast.success('Plan status updated')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Subscriptions</h1>
        <p className="text-gray-500">Manage subscription plans and user subscriptions</p>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="users">User Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className={!plan.isActive ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={plan.isActive}
                        onCheckedChange={() => togglePlanActive(plan.id)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => openEdit(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{plan.listings} listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-gray-500">/plan</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSubscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{sub.userName}</p>
                        <p className="text-sm text-gray-500">{sub.planName} Plan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {sub.listingsUsed}/{sub.listingsTotal} listings used
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(sub.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Update pricing and listing limits for {selectedPlan?.name} plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Number of Listings</Label>
              <Input
                type="number"
                value={editListings}
                onChange={(e) => setEditListings(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
