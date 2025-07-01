'use client'
export default function SuccessLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Processing your order...</p>
        <p className="text-gray-500 text-sm mt-2">This should only take a moment</p>
      </div>
    </div>
  )
} 