# Printify Integration Setup Guide

This guide will help you connect Printify to your website so that orders placed through your Stripe checkout automatically create orders on Printify for fulfillment.

## Prerequisites

1. **Printify Account**: Create an account at [printify.com](https://printify.com)
2. **Printify API Access**: Get your API access token
3. **Stripe Account**: Already set up ✅
4. **Products**: Your designs uploaded to Printify

## Step 1: Get Printify API Credentials

### 1.1 Create Personal Access Token

1. Log into your Printify account
2. Go to **My Profile** → **Connections**
3. Generate a new **Personal Access Token**
4. Copy the token (you won't see it again!)
5. Set access scopes:
   - `shops.read`
   - `products.read`
   - `products.write`
   - `orders.read`
   - `orders.write`
   - `uploads.read`
   - `uploads.write`

### 1.2 Get Shop ID

1. In Printify, go to **My Stores**
2. Add a new store and select **API** as the connection type
3. Note your Shop ID (you'll see it in the URL or API responses)

## Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# Existing Stripe variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# New Printify variables
PRINTIFY_ACCESS_TOKEN=your_printify_access_token_here
PRINTIFY_SHOP_ID=your_shop_id_here

# Stripe webhook secret (we'll get this in step 4)
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 3: Set Up Products in Printify

You have two options:

### Option A: Use Printify Dashboard (Recommended for beginners)

1. Go to **Catalog** in your Printify dashboard
2. Choose a product template (e.g., "Unisex Heavy Cotton Tee")
3. Upload your designs
4. Configure variants (sizes, colors)
5. Set prices
6. Save the product

### Option B: Use API (Advanced)

Run the setup script to see available options:

```bash
npm install tsx
npx tsx scripts/setup-printify.ts
```

This will show you:

- Your existing products
- Available product templates
- Product mapping template

## Step 4: Set Up Stripe Webhooks

### 4.1 Create Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
2. Click **Add endpoint**
3. Set URL to: `https://yourdomain.com/api/stripe-webhook`
4. Select events: `checkout.session.completed`
5. Copy the **Signing secret** and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### 4.2 Test Webhook (Local Development)

For testing locally, use Stripe CLI:

```bash
# Install Stripe CLI
# Then forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

## Step 5: Map Your Products

### 5.1 Get Product IDs

Run the setup script to get your Printify product IDs:

```bash
npx tsx scripts/setup-printify.ts
```

### 5.2 Update Product Mapping

Edit `app/api/stripe-webhook/route.ts` and update the `PRODUCT_MAPPING` object:

```typescript
const PRODUCT_MAPPING: Record<string, { printifyProductId: string; variantId: number }> = {
  'CDA Board Tee': { printifyProductId: 'actual_printify_id_1', variantId: 12345 },
  'CDA Dive Tee': { printifyProductId: 'actual_printify_id_2', variantId: 12346 },
  // ... add all your products
}
```

**Important**: The product names must match exactly what appears in your Stripe checkout.

## Step 6: Test the Integration

### 6.1 Test Order Flow

1. Add a product to your cart
2. Complete checkout with Stripe
3. Check your terminal/server logs for webhook events
4. Check your Printify dashboard for the new order

### 6.2 Debug Common Issues

**Webhook not receiving events:**

- Check webhook URL is correct
- Verify webhook secret in `.env.local`
- Check Stripe webhook logs for delivery attempts

**Product mapping errors:**

- Ensure product names match exactly
- Check Printify product IDs are correct
- Verify variant IDs exist

**Printify API errors:**

- Check access token is valid
- Verify shop ID is correct
- Ensure API scopes are sufficient

## Step 7: Go Live

### 7.1 Production Webhook

1. Deploy your app to production
2. Update Stripe webhook URL to your production domain
3. Switch Stripe to live mode
4. Update environment variables with live keys

### 7.2 Monitor Orders

- Check Stripe dashboard for payments
- Check Printify dashboard for order fulfillment
- Monitor server logs for any errors

## Workflow Summary

Here's what happens when a customer places an order:

1. **Customer** adds products to cart and checks out
2. **Stripe** processes payment and creates checkout session
3. **Stripe Webhook** triggers `checkout.session.completed` event
4. **Your API** receives webhook and extracts order details
5. **Product Mapping** converts your product names to Printify product IDs
6. **Printify API** creates order with customer shipping details
7. **Printify** fulfills and ships the order to customer

## Support

If you encounter issues:

1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with Stripe test mode first
4. Check Printify API documentation: [developers.printify.com](https://developers.printify.com)

## Security Notes

- Never commit API keys to version control
- Use environment variables for all secrets
- Verify webhook signatures to prevent unauthorized requests
- Monitor API usage to stay within rate limits

---

🎉 **Congratulations!** Your print-on-demand automation is now set up. Orders from your website will automatically be sent to Printify for fulfillment!
