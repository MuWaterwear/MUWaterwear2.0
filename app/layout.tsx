import type { Metadata } from 'next'
import { Actor } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import SessionProvider from '@/components/SessionProvider'
import CartErrorNotification from '@/components/CartErrorNotification'
import GlobalMobileNav from '@/components/responsive/GlobalMobileNav'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/contexts/ToastContext'
import { Responsive, MobileOnly, DesktopOnly } from '@/components/responsive/ResponsiveLayout'
import ShoppingCartSidebar from '@/components/ShoppingCartSidebar'

const actor = Actor({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MU Waterwear - Premium Water Sports Gear & Apparel',
  description:
    'Built for the water. Forged for legends. Premium gear and apparel for Pacific Northwest and Mountain West water warriors.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // MobileNavigation not used here (client-only)

  return (
    <html lang="en">
      <body className={`${actor.className} antialiased`}>
        <ErrorBoundary>
          <ToastProvider>
            <SessionProvider>
              <CartProvider>
                {children}
                <CartErrorNotification />
                <GlobalMobileNav />
                <ShoppingCartSidebar />
              </CartProvider>
            </SessionProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
