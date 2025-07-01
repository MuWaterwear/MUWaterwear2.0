'use client'
import { User, MapPin, Package, CreditCard, LogOut } from 'lucide-react'

interface UserMenuControlsProps {
  onEditProfile: () => void
  onManageAddresses: () => void
  onViewOrders: () => void
  onSignOut: () => void
  onShowInfo: (msg: string, type?: string) => void
  shippingCount?: number
  orderCount?: number
}

export default function UserMenuControls({
  onEditProfile,
  onManageAddresses,
  onViewOrders,
  onSignOut,
  onShowInfo,
  shippingCount = 0,
  orderCount = 0
}: UserMenuControlsProps) {
  return (
    <div className="divide-y divide-gray-800/70">
      <button onClick={onEditProfile} className="flex items-center gap-3 w-full py-2.5 px-3 hover:bg-gray-800/60 transition-colors text-gray-300 hover:text-white focus:outline-none" role="menuitem" aria-label="Edit profile">
        <User className="w-4 h-4" />
        <span>Profile Settings</span>
      </button>
      <button onClick={onManageAddresses} className="flex items-center gap-3 w-full py-2.5 px-3 hover:bg-gray-800/60 transition-colors text-gray-300 hover:text-white focus:outline-none" role="menuitem" aria-label="Manage shipping addresses">
        <MapPin className="w-4 h-4" />
        <span>Shipping Addresses</span>
        {shippingCount > 0 && <span className="ml-auto bg-cyan-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{shippingCount}</span>}
      </button>
      <button onClick={onViewOrders} className="flex items-center gap-3 w-full py-2.5 px-3 hover:bg-gray-800/60 transition-colors text-gray-300 hover:text-white focus:outline-none" role="menuitem" aria-label="View order history">
        <Package className="w-4 h-4" />
        <span>Order History</span>
        {orderCount > 0 && <span className="ml-auto bg-cyan-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{orderCount}</span>}
      </button>
      <button onClick={() => onShowInfo('Payment methods management coming soon!', 'info')} className="flex items-center gap-3 w-full py-2.5 px-3 hover:bg-gray-800/60 transition-colors text-gray-300 hover:text-white focus:outline-none" role="menuitem" aria-label="Manage payment methods">
        <CreditCard className="w-4 h-4" />
        <span>Payment Methods</span>
        <span className="ml-auto text-xs text-gray-500">Soon</span>
      </button>
      <div className="border-t border-gray-800/70 mt-2 pt-2">
        <button onClick={onSignOut} className="flex items-center gap-3 w-full py-2.5 px-3 hover:bg-gray-800/60 transition-colors text-gray-300 hover:text-white focus:outline-none" role="menuitem" aria-label="Sign out">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
} 