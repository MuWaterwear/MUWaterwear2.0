import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/core/auth'
import connectDB from '@/lib/core/database'
import Customer from '@/lib/models/Customer'

// GET – return current user's profile if authenticated
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const profile = await Customer.findOne({ email: session.user!.email })
  return NextResponse.json({ profile })
}

// POST – create or update profile
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await connectDB()
  const updated = await Customer.findOneAndUpdate(
    { email: session.user!.email },
    { ...body, updatedAt: new Date() },
    { upsert: true, new: true }
  )
  return NextResponse.json({ profile: updated })
} 