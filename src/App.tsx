import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Login from './pages/Login'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import Auctions from './pages/Auctions'
import AuctionDetail from './pages/AuctionDetail'
import SellRequests from './pages/SellRequests'
import SellRequestDetail from './pages/SellRequestDetail'
import Deals from './pages/Deals'
import DealDetail from './pages/DealDetail'
import Categories from './pages/Categories'
// import Subscriptions from './pages/Subscriptions'
import Reports from './pages/Reports'
// import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetail />} />
            
            <Route path="listings" element={<Listings />} />
            <Route path="listings/:id" element={<ListingDetail />} />
            
            <Route path="auctions" element={<Auctions />} />
            <Route path="auctions/:id" element={<AuctionDetail />} />
            
            <Route path="sell-requests" element={<SellRequests />} />
            <Route path="sell-requests/:id" element={<SellRequestDetail />} />
            
            <Route path="deals" element={<Deals />} />
            <Route path="deals/:id" element={<DealDetail />} />
            
            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
              <Route path="categories" element={<Categories />} />
              {/* <Route path="subscriptions" element={<Subscriptions />} /> */}
              <Route path="reports" element={<Reports />} />
            </Route>
            
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
