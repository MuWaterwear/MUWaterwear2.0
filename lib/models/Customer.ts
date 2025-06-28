import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  fullName: {
    type: String
  },
  // Track when customer was added
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Track last update
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Track customer interactions
  orders: [{
    stripeSessionId: String,
    orderDate: Date,
    amount: Number,
    items: [{
      name: String,
      price: String,
      quantity: Number,
      size: String
    }]
  }],
  // Marketing preferences
  emailOptIn: {
    type: Boolean,
    default: true
  },
  // Source tracking
  source: {
    type: String,
    default: 'website'
  }
}, {
  timestamps: true // This automatically handles createdAt and updatedAt
})

// Compound index for efficient queries
CustomerSchema.index({ email: 1, createdAt: -1 })

// Pre-save middleware to set fullName
CustomerSchema.pre('save', function(next) {
  this.fullName = `${this.firstName} ${this.lastName}`
  next()
})

// Create or get the model (handle hot reloads in development)
const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)

export default Customer 