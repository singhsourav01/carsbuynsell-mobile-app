export interface CreateListingPayload {
    lst_category_id: string
    lst_title: string
    lst_description?: string
    lst_type: 'BUY_NOW' | 'AUCTION'
    lst_price: number
    lst_auction_end?: string
    lst_min_increment?: number
}

export interface ListingImagePayload {
    urls: string[]
}

export interface Listing {
    lst_id: string
    lst_seller_id: string
    lst_category_id: string
    lst_title: string
    lst_description: string | null
    lst_type: 'BUY_NOW' | 'AUCTION'
    lst_status: 'DRAFT' | 'ACTIVE' | 'SOLD' | 'EXPIRED'
    lst_price: number | string
    lst_current_bid: number | string | null
    lst_min_increment: number | string | null
    lst_auction_end: string | null
    lst_is_featured: boolean
    lst_bid_count: number
    lst_view_count: number
    lst_created_at: string
    lst_updated_at: string
    seller: {
        user_id: string
        user_full_name: string
        user_profile_image_file_id: string | null
    }
    category: {
        cat_id: string
        cat_name: string
        cat_slug: string
    }
    images: {
        limg_id: string
        limg_url: string
        limg_order: number
    }[]
}
