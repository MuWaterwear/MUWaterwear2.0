export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-[#007bbf]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#007bbf] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-white/60 text-sm">Loading...</p>
      </div>
    </div>
  )
}
