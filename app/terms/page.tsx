'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import LegalCTA from '@/components/LegalCTA'

export default function TermsOfServicePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using the MU Waterwear website ("Site"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Site.`,
    },
    {
      title: 'Products & Orders',
      content: `All products listed on our Site are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice.`,
    },
    {
      title: 'Shipping & Returns',
      content: `Shipping and return policies are outlined on the Shipping and Returns pages of our Site. By placing an order, you acknowledge and agree to these policies.`,
    },
    {
      title: 'Intellectual Property',
      content: `All content on the Site—including text, graphics, logos, images, and software—is the property of MU Waterwear or its content suppliers and is protected by copyright and other intellectual property laws.`,
    },
    {
      title: 'User Conduct',
      content: `You agree not to use the Site for any unlawful purpose, to solicit others to perform or participate in any unlawful acts, or to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.`,
    },
    {
      title: 'Limitation of Liability',
      content: `MU Waterwear shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of your use of the Site or the purchase of any products.`,
    },
    {
      title: 'Governing Law',
      content: `These Terms and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the State of Oregon, USA.`,
    },
    {
      title: 'Changes to Terms',
      content: `We reserve the right to update, change, or replace any part of these Terms by posting updates and/or changes to our Site. It is your responsibility to check this page periodically for changes.`,
    },
    {
      title: 'Contact Information',
      content: `Questions about the Terms should be sent to us at info@muwaterwear.com.`,
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
              Terms of Service
            </h1>
            <p className="text-xl text-slate-400 mb-4">
              Please read these terms carefully before using MU Waterwear
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
        title="Looking for more information?"
        description="Our team is happy to assist with any questions about these terms."
        primaryButtonText="Contact Support"
        primaryButtonHref="mailto:info@muwaterwear.com"
        secondaryButtonText="View Privacy Policy"
        secondaryButtonHref="/privacy-policy"
      />

      {/* Footer */}
      <Footer />
    </div>
  )
} 