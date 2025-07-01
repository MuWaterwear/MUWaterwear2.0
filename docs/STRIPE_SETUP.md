# Stripe Setup Guide for MU Waterwear

## Required Environment Variables

To enable Stripe checkout functionality, add these environment variables to your `.env.local` file:

```bash
# Stripe Configuration
# Get these from your Stripe Dashboard (https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## How to Get Your Stripe Keys

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and sign up
2. **Access Dashboard**: Log into your [Stripe Dashboard](https://dashboard.stripe.com)
3. **Get API Keys**:
   - Go to Developers → API Keys
   - Copy the **Publishable key** (starts with `pk_test_`) → Use for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy the **Secret key** (starts with `sk_test_`) → Use for `STRIPE_SECRET_KEY`

## What the Integration Includes

✅ **Desktop & Mobile Checkout** - Both shopping carts now use Stripe
✅ **Secure Payment Processing** - All payments handled by Stripe
✅ **Automatic Tax Calculation** - Stripe handles tax calculation
✅ **Address Collection** - Shipping and billing addresses collected
✅ **Success Page** - Users redirected to confirmation page after payment
✅ **Cart Integration** - Cart items automatically sent to Stripe

## Features

- **Payment Methods**: Credit/debit cards via Stripe
- **Security**: PCI compliant payment processing
- **Mobile Optimized**: Touch-friendly checkout experience
- **Tax Handling**: Automatic tax calculation by location
- **Shipping**: Address collection for order fulfillment
- **Order Tracking**: Session IDs for order management

## Testing

Use Stripe's test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## Production Setup

1. Switch to **Live mode** in Stripe Dashboard
2. Replace test keys with live keys
3. Update `NEXT_PUBLIC_BASE_URL` to your production domain
4. Configure webhooks for order management (optional)

---

**Built for water. Forged for legends.**
_MU Waterwear - Premium water sports gear with secure checkout_
