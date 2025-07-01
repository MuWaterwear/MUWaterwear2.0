'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface NewsletterSignupProps {
  source: 'homepage' | 'gear' | 'apparel' | 'accessories' | 'about'
  placeholder?: string
  buttonText?: string
  className?: string
}

export default function NewsletterSignup({
  source,
  placeholder = 'Enter your email',
  buttonText = 'SIGN UP',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setMessage('Please enter your email address')
      setIsSuccess(false)
      return
    }

    // Basic email validation
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address')
      setIsSuccess(false)
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe')
      }

      const result = await response.json()

      if (result.success) {
        setMessage(result.message)
        setIsSuccess(true)
        setShowAnimation(true)
        setEmail('') // Clear the form

        // Hide animation after 3 seconds
        setTimeout(() => {
          setShowAnimation(false)
        }, 3000)
      } else {
        setMessage(result.error || 'Failed to subscribe')
        setIsSuccess(false)
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
      setMessage('There was an error. Please try again.')
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Success Animation Overlay */}
      {showAnimation && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce bg-green-500 rounded-full p-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Celebration particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.8 + Math.random() * 0.4}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto transition-all duration-300 ${
          showAnimation ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
        }`}
      >
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting || showAnimation}
          className="flex-1 px-6 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isSubmitting || showAnimation}
          className={`font-bold px-8 py-4 shadow-lg transition-all disabled:opacity-50 ${
            isSuccess && showAnimation
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20 hover:shadow-green-500/30'
              : 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-cyan-500/20 hover:shadow-cyan-500/30'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              Subscribing...
            </div>
          ) : showAnimation ? (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              SUCCESS!
            </div>
          ) : (
            buttonText
          )}
        </Button>
      </form>

      {message && (
        <div
          className={`mt-4 text-center text-sm transition-all duration-300 ${
            isSuccess ? 'text-green-400 animate-pulse' : 'text-red-400'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
