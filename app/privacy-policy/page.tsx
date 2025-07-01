'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Waves, ShoppingCart, Menu, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import LegalCTA from '@/components/LegalCTA'
import { formatDate } from '@/lib/utils'

export default function PrivacyPolicyPage() {
  const { setIsCartOpen, getCartItemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, or contact us for support. This information may include:
      
      • Name and contact information
      • Billing and shipping addresses
      • Payment information (processed securely through Stripe)
      • Purchase history and preferences
      • Communications with our team`,
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
      
      • Process and fulfill your orders
      • Send you order confirmations and shipping updates
      • Respond to your questions and provide customer support
      • Send you marketing communications (with your consent)
      • Improve our products and services
      • Comply with legal obligations`,
    },
    {
      title: 'Information Sharing',
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:
      
      • Service providers who assist in our operations (e.g., shipping partners, payment processors)
      • Law enforcement when required by law
      • Business partners with your explicit consent`,
    },
    {
      title: 'Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
      
      • SSL encryption for all data transmission
      • Secure payment processing through trusted providers
      • Regular security audits and updates
      • Limited access to personal information by authorized personnel only`,
    },
    {
      title: 'Your Rights',
      content: `You have the right to:
      
      • Access the personal information we hold about you
      • Request correction of inaccurate information
      • Request deletion of your personal information
      • Opt-out of marketing communications
      • Data portability where applicable
      
      To exercise these rights, please contact us at privacy@muwaterwear.com`,
    },
    {
      title: 'Cookies and Tracking',
      content: `We use cookies and similar tracking technologies to:
      
      • Remember your preferences and settings
      • Analyze site traffic and usage patterns
      • Personalize your experience
      • Enable social media features
      
      You can control cookie settings through your browser preferences.`,
    },
    {
      title: 'Updates to This Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.`,
    },
    {
      title: 'Contact Us',
      content: `If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
      
      MU Waterwear
      Email: privacy@muwaterwear.com
      Phone: 1-800-MU-WATER
      
      We aim to respond to all privacy-related inquiries within 48 hours.`,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          <svg
            className="absolute bottom-0 w-full h-96"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="url(#oceanGradient)"
              fillOpacity="0.1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              style={{ animation: 'wave 20s ease-in-out infinite' }}
            />
            <defs>
              <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0891B2" />
                <stop offset="100%" stopColor="#0C4A6E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
          </div>

      {/* Navigation */}
      <NavigationBar onMobileMenuOpen={() => setMobileMenuOpen(true)} />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-400 mb-4">
              Your privacy is important to us at MU Waterwear
            </p>
            <p className="text-sm text-slate-500">
              Last Updated: {formatDate(new Date('2024-01-15'))}
                </p>
              </div>
            </div>
      </section>

      {/* Content */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-lg text-slate-300 mb-8">
                This Privacy Policy describes how MU Waterwear ("we", "us", or "our") collects, uses,
                and shares your personal information when you visit our website or make a purchase
                from us.
              </p>

              <div className="space-y-12">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-8 border border-slate-800"
                  >
                    <h2 className="text-2xl font-bold mb-4 text-cyan-400">{section.title}</h2>
                    <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                      {section.content}
              </div>
            </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <LegalCTA
        title="Questions About Your Privacy?"
        description="Our team is here to help you understand how we protect your data."
        primaryButtonText="Contact Privacy Team"
        primaryButtonHref="mailto:privacy@muwaterwear.com"
        secondaryButtonText="View Terms of Service"
        secondaryButtonHref="/terms"
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}
