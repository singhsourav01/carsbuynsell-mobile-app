export interface CreateListingPayload {
    lst_category_id: string
    lst_title: string
    lst_description?: string
    lst_type: 'BUY_NOW' | 'AUCTION'
    lst_price: number
    lst_auction_end?: string
    lst_min_increment?: number
    vehicle_details?: VehicleDetailsPayload
    user_portfolio?: UploadedPortfolioFile[] | string[]
}

export interface VehicleDetailsPayload {
    fuel_type?: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC'
    transmission?: 'MANUAL' | 'AUTOMATIC'
    body_type?: 'SEDAN' | 'MUV' | 'SUV' | 'LUXURY' | 'HATCHBACK'
    ownership?: 'FIRST_OWNER' | 'SECOND_OWNER' | 'THIRD_OWNER' | 'FOURTH_OWNER_PLUS'
    year?: number
    kilometers?: number
}

export interface UploadedPortfolioFile {
    file_id: string
    file_uploaded_by_id: string
    file_upload_type: string
    file_is_deleted: boolean
    file_media_type: string
    file_url: string
    file_created_at: string
    file_updated_at: string
    file_thumbnail_url: string | null
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
    vehicle_details?: {
        lvd_id?: string
        lvd_fuel_type?: string
        lvd_transmission?: string
        lvd_body_type?: string
        lvd_ownership?: string
        lvd_year?: number
        lvd_kilometers?: number
    } | null
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

// Auction types
export interface Auction extends Listing {
    _count?: {
        bids: number
        engagements: number
    }
}

export interface AuctionBid {
    bid_id: string
    bid_amount: string
    bid_created_at: string
    bidder: {
        user_id: string
        user_full_name: string
        user_email: string
        user_primary_phone: string
        user_profile_image_file_id: string | null
    }
}

export interface AuctionEngagement {
    eng_id: string
    eng_status: string
    eng_created_at: string
    eng_closed_at: string | null
    user: {
        user_id: string
        user_full_name: string
        user_email: string
        user_primary_phone: string
        user_profile_image_file_id: string | null
    }
}

export interface AuctionParticipant {
    user: {
        user_id: string
        user_full_name: string
        user_email: string
        user_primary_phone: string
        user_profile_image_file_id: string | null
    }
    engagement_status: string
    joined_at: string
    highest_bid: number
    total_bids: number
}

export interface AuctionDetail extends Auction {
    bids: AuctionBid[]
    engagements: AuctionEngagement[]
    participants: AuctionParticipant[]
    total_participants: number
    total_bids: number
}
