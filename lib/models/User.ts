import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' },
  isDefault: { type: Boolean, default: false },
})

const UserSchema = new mongoose.Schema(
  {
    // Authentication fields
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function (this: any): boolean {
        return !this.provider || this.provider === 'credentials'
      },
      minlength: 6,
    },

    // Profile information
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    // Computed field
    fullName: {
      type: String,
    },

    // Shipping addresses
    addresses: [AddressSchema],
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },

    // Order history
    orders: [
      {
        stripeSessionId: String,
        orderDate: { type: Date, default: Date.now },
        amount: Number,
        status: String,
        items: [
          {
            name: String,
            price: String,
            quantity: Number,
            size: String,
            image: String,
          },
        ],
        shippingAddress: {
          street: String,
          city: String,
          state: String,
          postalCode: String,
          country: String,
        },
      },
    ],

    // Preferences
    preferences: {
      emailMarketing: { type: Boolean, default: true },
      smsMarketing: { type: Boolean, default: false },
      currency: { type: String, default: 'USD' },
      newsletter: { type: Boolean, default: true },
    },

    // Account status
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // OAuth provider info
    provider: {
      type: String,
      enum: ['credentials', 'google', 'facebook'],
      default: 'credentials',
    },
    providerId: String,

    // Security
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Analytics
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    source: { type: String, default: 'website' },
  },
  {
    timestamps: true,
  }
)

// Indexes for performance
UserSchema.index({ email: 1 })
UserSchema.index({ 'addresses.isDefault': 1 })
UserSchema.index({ createdAt: -1 })

// Virtual for full name
UserSchema.virtual('displayName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

// Pre-save middleware
UserSchema.pre('save', async function (next) {
  // Set full name
  this.fullName = `${this.firstName} ${this.lastName}`

  // Hash password if modified
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12)
  }

  next()
})

// Instance methods
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

UserSchema.methods.getDefaultAddress = function () {
  return this.addresses.find((addr: any) => addr.isDefault) || this.addresses[0]
}

UserSchema.methods.addOrder = function (orderData: any) {
  this.orders.push(orderData)
  return this.save()
}

UserSchema.methods.updateLoginInfo = function () {
  this.lastLogin = new Date()
  this.loginCount += 1
  return this.save()
}

// Static methods
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() })
}

UserSchema.statics.createUser = async function (userData: any) {
  const user = new this(userData)
  await user.save()
  return user
}

// Create or get the model
const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User
