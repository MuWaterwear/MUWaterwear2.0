import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Customer from '@/lib/models/Customer'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, cartItems = [] } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email' },
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

    // Check if customer already exists
    let customer = await Customer.findOne({ email: email.toLowerCase() })

    if (customer) {
      // Update existing customer
      customer.firstName = firstName.trim()
      customer.lastName = lastName.trim()
      customer.fullName = `${firstName.trim()} ${lastName.trim()}`
      customer.updatedAt = new Date()
      
      await customer.save()

      console.log('Updated existing customer:', customer.email)

      return NextResponse.json({
        success: true,
        message: 'Customer information updated',
        customerId: customer._id,
        isNewCustomer: false
      })
    } else {
      // Create new customer
      customer = new Customer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        source: 'website_checkout'
      })

      await customer.save()

      console.log('Created new customer:', customer.email)

      return NextResponse.json({
        success: true,
        message: 'Customer information saved',
        customerId: customer._id,
        isNewCustomer: true
      })
    }

  } catch (error) {
    console.error('Error saving customer data:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to save customer information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 