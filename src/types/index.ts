export type UserStatus = 'pending' | 'accepted' | 'rejected' | 'blocked'
export type UserRole = 'ADMIN' | 'USER' | 'MODERATOR'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: UserStatus
  role: UserRole
  isVerified: boolean
  createdAt: string
}

// API response types for auth
export interface ApiUser {
  user_id: string
  user_full_name: string
  user_email: string
  user_primary_phone: string
  user_role: UserRole
  user_admin_status: string
  user_email_verified: boolean
  user_phone_verified: boolean
  user_profile_image_file_id: string | null
  user_created_at: string
  access_token: string
  refresh_token: string
}

export interface AuthResponse {
  statusCode: number
  data: ApiUser
  message: string
  success: boolean
}

export type ListingType = 'auction' | 'buy_now'
export type ListingStatus = 'active' | 'sold' | 'expired' | 'draft'

export interface Listing {
  id: string
  title: string
  description: string
  images: string[]
  type: ListingType
  category: string
  price: number
  bidCount: number
  currentBid?: number
  sellerId: string
  sellerName: string
  status: ListingStatus
  createdAt: string
  endsAt?: string
}

export interface Auction {
  id: string
  listingId: string
  listing: Listing
  currentBid: number
  bidCount: number
  highestBidder?: string
  endsAt: string
  isActive: boolean
}

export interface Bid {
  id: string
  auctionId: string
  userId: string
  userName: string
  amount: number
  createdAt: string
}

export type SellRequestStatus = 'pending' | 'approved' | 'rejected'

export interface SellRequest {
  id: string
  userId: string
  userName: string
  title: string
  description: string
  category: string
  expectedPrice: number
  images: string[]
  status: SellRequestStatus
  rejectionReason?: string
  createdAt: string
}

export type DealStatus = 'won' | 'pending_payment' | 'completed' | 'lost'

export interface Deal {
  id: string
  listingId: string
  listingTitle: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  type: ListingType
  price: number
  status: DealStatus
  createdAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  listingCount: number
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  listings: number
  features: string[]
  isActive: boolean
}

export interface Subscription {
  id: string
  userId: string
  userName: string
  planId: string
  planName: string
  listingsUsed: number
  listingsTotal: number
  startedAt: string
  expiresAt: string
  isActive: boolean
}
