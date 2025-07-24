import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
})

export async function GET(_req: NextRequest) {
  if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    return NextResponse.json({ error: 'ImageKit environment variables are not set.' }, { status: 500 })
  }

  // Generate authentication parameters valid for the next few minutes
  const authParameters = imagekit.getAuthenticationParameters()

  return NextResponse.json(authParameters, { status: 200 })
} 