import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '../models/User'
import connectDB from './database'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email.toLowerCase() })
        if (!user) {
          throw new Error('No user found with this email')
        }

        const isValid = await user.comparePassword(credentials.password)
        if (!isValid) {
          throw new Error('Invalid password')
        }

        if (!user.isActive) {
          throw new Error('Account is disabled')
        }

        // Update login info
        await user.updateLoginInfo()

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          addresses: user.addresses,
          preferences: user.preferences,
          isEmailVerified: user.isEmailVerified,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.userId = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phone = user.phone
        token.addresses = user.addresses
        token.preferences = user.preferences
        token.isEmailVerified = user.isEmailVerified
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        await connectDB()
        const dbUser = await User.findById(token.userId)
        if (dbUser) {
          token.firstName = dbUser.firstName
          token.lastName = dbUser.lastName
          token.phone = dbUser.phone
          token.addresses = dbUser.addresses
          token.preferences = dbUser.preferences
          token.isEmailVerified = dbUser.isEmailVerified
          token.name = dbUser.fullName
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.phone = token.phone as string
        session.user.addresses = token.addresses as any[]
        session.user.preferences = token.preferences as any
        session.user.isEmailVerified = token.isEmailVerified as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      firstName: string
      lastName: string
      phone?: string
      addresses: any[]
      preferences: any
      isEmailVerified: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    firstName: string
    lastName: string
    phone?: string
    addresses: any[]
    preferences: any
    isEmailVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    firstName: string
    lastName: string
    phone?: string
    addresses: any[]
    preferences: any
    isEmailVerified: boolean
  }
}
