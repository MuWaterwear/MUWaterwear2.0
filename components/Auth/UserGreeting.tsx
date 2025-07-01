'use client'
interface UserGreetingProps {
  greeting: string
  isAuthenticated: boolean
}
export default function UserGreeting({ greeting, isAuthenticated }: UserGreetingProps) {
  return (
    <div className="text-center">
      <p className="text-white font-medium text-sm">{greeting}</p>
      {isAuthenticated && (
        <p className="text-cyan-400 text-xs mt-1">✓ Signed in with NextAuth</p>
      )}
    </div>
  )
} 