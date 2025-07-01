import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await the params since they're now async in Next.js 15+
    const resolvedParams = await params

    // Get the file path from the URL parameters
    const filePath = resolvedParams.path.join('/')

    // Decode any URL-encoded characters in the path
    const decodedPath = decodeURIComponent(filePath)

    // Log for debugging
    console.log('🖼️ Image request:', {
      originalPath: filePath,
      decodedPath: decodedPath,
      url: request.url,
    })

    // Construct the full file path
    const fullPath = path.join(process.cwd(), 'public', 'images', decodedPath)

    console.log('📁 Looking for file at:', fullPath)

    // Check if file exists first
    try {
      await fs.access(fullPath)
    } catch {
      console.error('❌ File not found at:', fullPath)

      // Try to list directory contents for debugging
      const dirPath = path.dirname(fullPath)
      try {
        const files = await fs.readdir(dirPath)
        console.log('📂 Directory contents:', files)
      } catch (dirError) {
        console.error('❌ Directory not found:', dirPath)
      }

      return new NextResponse('Image not found', { status: 404 })
    }

    // Read the file
    const fileBuffer = await fs.readFile(fullPath)

    // Determine content type based on file extension
    const ext = path.extname(decodedPath).toLowerCase()
    const contentTypeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    }

    const contentType = contentTypeMap[ext] || 'application/octet-stream'

    console.log('✅ Successfully serving image:', decodedPath)

    // Return the image with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('❌ Error serving image:', error)
    return new NextResponse('Image not found', { status: 404 })
  }
}
