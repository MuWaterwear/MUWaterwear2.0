"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ShoppingCart, Menu, ChevronDown } from "lucide-react"
import Link from "next/link";
import Image from "next/image";
import ShoppingCartSidebar from "@/components/ShoppingCartSidebar"
import { useCart } from "@/contexts/CartContext"

export default function PrivacyPolicyPage() {
  const { setIsCartOpen, getCartItemCount } = useCart()

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="flex flex-col items-center justify-center py-1 cursor-pointer hover:opacity-80 transition-opacity focus:ring-2 focus:ring-cyan-400/50 focus:outline-none rounded"
                aria-label="MU Waterwear Home"
              >
                <p className="text-xs text-gray-400 tracking-[0.2em] font-light mb-0">CA • OR • WA • ID • MT</p>
            <Image 
                  src="/images/Mu (2).svg"
                  alt="MU Waterwear Logo"
                  width={200}
                  height={80}
                  className="h-10 w-auto transition-all duration-300 hover:scale-105"
                  style={{ transform: 'scale(9.0)' }}
                  priority
            />
          </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-cyan-400 transition-colors font-medium flex items-center gap-1"
                  >
                    WATERWAYS
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white w-72 min-w-72">
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/coeur-dalene" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image
                          src="/images/lake-icon.png"
                          alt="Lakes"
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">Coeur D' Alene Lake, ID </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/detroit-lake" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image
                          src="/images/waterway-outline-2.png"
                          alt="Bays"
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">Detroit Lake, OR </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/flathead" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image
                          src="/images/stream-icon.png"
                          alt="Streams"
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">Flathead Lake, MT </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/lake-tahoe" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image
                          src="/images/laketahoeicon.svg"
                          alt="Lake Tahoe"
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">Lake Tahoe, CA/NV</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/lake-washington" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image
                          src="/images/waterway-outline-1.png"
                          alt="Coastlines"
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">Lake Washington, WA </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 py-4 px-6 rounded-md">
                    <Link href="/lindbergh" className="w-full flex items-center justify-start gap-4 px-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <Image
                          src="/images/river-icon.png"
                          alt="Rivers"
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">Lindbergh Lake, MT</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/gear" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                GEAR
              </Link>
              <Link href="/apparel" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                APPAREL
              </Link>
              <Link href="/accessories" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                ACCESSORIES
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                ABOUT
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-cyan-400 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {getCartItemCount()}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:text-cyan-400">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <ShoppingCartSidebar />

      {/* Privacy Policy Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-gray-400">Last updated: December 2024</p>
          </div>
          
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-8 md:p-12 space-y-8">
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Information We Collect</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We collect information you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, or contact us for support.
                </p>
                <p>
                  This may include your name, email address, shipping address, billing information, and phone number.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">How We Use Your Information</h2>
              <div className="space-y-4 text-gray-300">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Process your orders and payments</li>
                  <li>Send you newsletters and marketing communications (if you've opted in)</li>
                  <li>Provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Information Sharing</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy.
                </p>
                <p>
                  We may share your information with service providers who assist us in operating our website, conducting business, or serving you, provided they agree to keep this information confidential.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Data Security</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p>
                  However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Cookies</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from.
                </p>
                <p>
                  You can choose to disable cookies through your browser settings, but this may affect the functionality of our website.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Your Rights</h2>
              <div className="space-y-4 text-gray-300">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your personal information</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Newsletter</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  If you sign up for our newsletter, we will use your email address to send you updates about new products, cleanup events, and exclusive discounts.
                </p>
                <p>
                  You can unsubscribe at any time by clicking the unsubscribe link in our emails or contacting us directly.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Contact Us</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="font-medium">
                  Email: info@muwaterwear.com
                </p>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <p className="text-gray-400 text-sm">
                This Privacy Policy may be updated from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-light text-gray-300">&copy; 2024 MU Waterwear. Engineered for water. Built for performance.</p>
          <div className="mt-4">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
} 