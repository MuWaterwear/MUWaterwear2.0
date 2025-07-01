import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, customerEmail } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // For now, we'll just return success since the frontend will handle
    // saving to localStorage. In the future, this could save to the database
    // for authenticated users.

    return NextResponse.json(
      {
        message: 'Shipping address saved successfully',
        success: true,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving shipping address:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
