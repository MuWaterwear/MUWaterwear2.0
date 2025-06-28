import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Newsletter from '@/lib/models/Newsletter'

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'other' } = await request.json()

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ 
      email: email.toLowerCase() 
    })

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return NextResponse.json({
          success: true,
          message: 'Already subscribed to newsletter',
          isNewSubscription: false
        })
      } else {
        // Reactivate unsubscribed email
        existingSubscription.status = 'active'
        existingSubscription.source = source
        existingSubscription.updatedAt = new Date()
        
        await existingSubscription.save()

        console.log('Reactivated newsletter subscription:', existingSubscription.email)

        return NextResponse.json({
          success: true,
          message: 'Newsletter subscription reactivated',
          isNewSubscription: false
        })
      }
    }

    // Create new newsletter subscription
    const newsletterSubscription = new Newsletter({
      email: email.toLowerCase().trim(),
      source,
      userAgent: request.headers.get('user-agent') || undefined,
      // Note: Getting real IP in production might need additional headers
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown'
    })

    await newsletterSubscription.save()

    console.log('New newsletter subscription:', newsletterSubscription.email, 'from:', source)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      isNewSubscription: true
    })

  } catch (error) {
    console.error('Error saving newsletter subscription:', error)
    
    // Handle duplicate key error specifically
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({
        success: true,
        message: 'Already subscribed to newsletter',
        isNewSubscription: false
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to subscribe to newsletter',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 