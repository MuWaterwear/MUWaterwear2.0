'use client'
import { User } from 'lucide-react'

interface UserProfileButtonProps {
  onClick: () => void
  userDisplayName: string
  isOpen: boolean
}
export default function UserProfileButton({ onClick, userDisplayName, isOpen }: UserProfileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 bg-cyan-400/20 rounded-full flex items-center justify-center hover:bg-cyan-400/30 transition-colors border border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
      title={`${userDisplayName} - Click to manage profile`}
      aria-label={`User profile for ${userDisplayName}`}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <User className="w-5 h-5 text-cyan-400" />
    </button>
  )
} 