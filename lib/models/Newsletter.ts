import mongoose from 'mongoose'

const NewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      unique: true, // Prevent duplicate email subscriptions
    },
    // Track subscription status
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
    },
    // Track where they signed up from
    source: {
      type: String,
      required: true,
      enum: ['homepage', 'gear', 'apparel', 'accessories', 'about', 'other'],
    },
    // Marketing preferences
    preferences: {
      newProducts: { type: Boolean, default: true },
      sales: { type: Boolean, default: true },
      lakeReports: { type: Boolean, default: true },
    },
    // User agent for analytics
    userAgent: String,
    // IP for geo-targeting (optional)
    ipAddress: String,
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
)

// Compound index for efficient queries
NewsletterSchema.index({ email: 1, status: 1 })
NewsletterSchema.index({ source: 1, createdAt: -1 })

// Create or get the model (handle hot reloads in development)
const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema)

export default Newsletter
