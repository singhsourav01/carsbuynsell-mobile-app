import { Badge } from '@/components/ui/badge'
import type { UserStatus, ListingStatus, ListingType, SellRequestStatus, DealStatus } from '@/types'

type Status = UserStatus | ListingStatus | ListingType | SellRequestStatus | DealStatus

interface StatusBadgeProps {
  status: Status
}

const statusConfig: Record<Status, { label: string; variant: string }> = {
  pending: { label: 'Pending', variant: 'pending' },
  accepted: { label: 'Accepted', variant: 'accepted' },
  rejected: { label: 'Rejected', variant: 'rejected' },
  blocked: { label: 'Blocked', variant: 'blocked' },
  active: { label: 'Active', variant: 'active' },
  sold: { label: 'Sold', variant: 'sold' },
  expired: { label: 'Expired', variant: 'outline' },
  draft: { label: 'Draft', variant: 'outline' },
  auction: { label: 'Auction', variant: 'auction' },
  buy_now: { label: 'Buy Now', variant: 'buy_now' },
  approved: { label: 'Approved', variant: 'accepted' },
  won: { label: 'Won', variant: 'won' },
  pending_payment: { label: 'Pending Payment', variant: 'pending_payment' },
  completed: { label: 'Completed', variant: 'completed' },
  lost: { label: 'Lost', variant: 'lost' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'outline' }
  return <Badge variant={config.variant as 'default'}>{config.label}</Badge>
}
