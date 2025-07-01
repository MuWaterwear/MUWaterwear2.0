'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { ShippingAddressManager } from './profile/ShippingAddressManager'
import { OrderHistoryViewer } from './profile/OrderHistoryViewer'
import { QuickProfileForm } from './profile/QuickProfileForm'
import { useUserProfile } from '@/hooks/useUserProfile'
import { usePersonalizedGreeting } from '@/hooks/usePersonalizedGreeting'
import { useToast } from '@/contexts/ToastContext'
import UserGreeting from './Auth/UserGreeting'
import UserMenuControls from './Auth/UserMenuControls'
import UserProfileButton from './Auth/UserProfileButton'

export default function UserAccountButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isManagingAddresses, setIsManagingAddresses] = useState(false)
  const [isViewingOrders, setIsViewingOrders] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { showSuccess, showError, showInfo } = useToast()

  // Use custom hooks
  const {
    status,
    cachedUser,
    currentUser,
    isAuthenticated,
    userDisplayName,
    loading,
    error,
    saveCachedUser,
    clearUserProfile,
    saveShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
    saveOrderToHistory,
  } = useUserProfile()

  const { getPersonalizedGreeting, rotateGreeting } = usePersonalizedGreeting(
    currentUser,
    cachedUser
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsEditingProfile(false)
        setIsManagingAddresses(false)
        setIsViewingOrders(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      clearUserProfile()
      if (isAuthenticated) {
        await signOut({ callbackUrl: '/' })
        showSuccess('Successfully signed out')
      }
      setIsOpen(false)
    } catch (error) {
      console.error('Error during sign out:', error)
      showError('Error signing out. Please try again.')
    }
  }

  const handleProfileClick = () => {
    setIsOpen(!isOpen)
    rotateGreeting()
  }

  const handleAddressAction = (action: string, success: boolean) => {
    if (success) {
      showSuccess(`Address ${action} successfully`)
    } else {
      showError(`Failed to ${action} address`)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse"></div>
  }

  if (!currentUser && !isAuthenticated) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors border border-gray-600"
          title="Sign in or create account"
          aria-label="User account options"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-800/70 shadow-xl z-50">
            <div className="p-4 space-y-3 text-sm text-gray-300">
              <h3 className="text-white font-semibold text-center mb-4">Welcome to MU Waterwear</h3>
              <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                <button className="w-full flex items-center gap-2 py-2.5 px-3 bg-brand-accent hover:bg-brand-accent/90 text-sand font-medium rounded-md transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l4-4m-4 4l4 4" /></svg>
                  <span>Sign In</span>
                </button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                <button className="w-full flex items-center gap-2 py-2.5 px-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md transition-colors duration-200 border border-gray-700/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
                  <span>Create Account</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {error && (
        <div className="absolute -top-12 right-0 bg-red-500 text-white text-xs p-2 rounded-lg shadow-lg z-50 max-w-xs">
          {error}
        </div>
      )}
      <UserProfileButton onClick={handleProfileClick} userDisplayName={userDisplayName} isOpen={isOpen} />
      {isOpen && !isEditingProfile && !isManagingAddresses && !isViewingOrders && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-800/70 shadow-xl z-50" role="menu" aria-labelledby="user-menu-button">
          <div className="p-3 border-b border-gray-800">
            <UserGreeting greeting={getPersonalizedGreeting()} isAuthenticated={isAuthenticated} />
          </div>
          <UserMenuControls
            onEditProfile={() => setIsEditingProfile(true)}
            onManageAddresses={() => setIsManagingAddresses(true)}
            onViewOrders={() => setIsViewingOrders(true)}
            onSignOut={handleSignOut}
            onShowInfo={showInfo}
            shippingCount={cachedUser?.shippingAddresses?.length || 0}
            orderCount={cachedUser?.orderHistory?.length || 0}
          />
        </div>
      )}
      {isEditingProfile && (
        <QuickProfileForm
          initialData={cachedUser || undefined}
          onSave={(userData) => {
            saveCachedUser(userData)
            showSuccess('Profile updated successfully')
          }}
          onClose={() => {
            setIsEditingProfile(false)
            setIsOpen(false)
          }}
        />
      )}
      {isManagingAddresses && (
        <ShippingAddressManager
          addresses={cachedUser?.shippingAddresses || []}
          onSave={(address) => {
            saveShippingAddress(address)
            handleAddressAction('saved', true)
          }}
          onUpdate={(id, address) => {
            updateShippingAddress(id, address)
            handleAddressAction('updated', true)
          }}
          onDelete={(id) => {
            deleteShippingAddress(id)
            handleAddressAction('deleted', true)
          }}
          onClose={() => {
            setIsManagingAddresses(false)
            setIsOpen(false)
          }}
        />
      )}
      {isViewingOrders && (
        <OrderHistoryViewer
          orders={cachedUser?.orderHistory || []}
          onClose={() => {
            setIsViewingOrders(false)
            setIsOpen(false)
          }}
        />
      )}
    </div>
  )
}
