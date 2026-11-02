import { apiClient } from '@/services/api-client'

// A Buy Now "request" is an order created when a user submits the Buy Now form
// in the user service. Many buyers can request the same listing.
export interface BuyNowRequest {
  ord_id: string
  ord_buyer_id: string
  ord_listing_id: string
  ord_amount: number | string
  ord_status: string
  ord_created_at: string
  ord_updated_at: string
  buyer?: { user_id: string; user_full_name: string; user_email: string } | null
  listing?: {
    lst_id: string
    lst_title: string
    lst_price: number | string
    lst_type: 'BUY_NOW' | 'AUCTION'
    lst_status: string
  } | null
}

// Fetches recent orders and keeps only those placed on Buy Now listings.
export async function fetchBuyNowRequests(pageSize = 100): Promise<BuyNowRequest[]> {
  const response = await apiClient.get(`/user/admin/orders?page=1&page_size=${pageSize}`)
  const orders: BuyNowRequest[] = response.data?.data?.orders || []
  return orders.filter((o) => o.listing?.lst_type === 'BUY_NOW')
}

export function requestStatusClass(status: string) {
  switch (status) {
    case 'CONFIRMED':
    case 'DELIVERED':
      return 'bg-green-100 text-green-700'
    case 'PENDING':
    case 'SHIPPED':
      return 'bg-amber-100 text-amber-700'
    case 'CANCELLED':
    case 'REFUNDED':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
