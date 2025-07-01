import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { items, couponCode, actualCosts, effectiveTotal, customerInfo } = await request.json()

    console.log('Received items for checkout:', JSON.stringify(items, null, 2))
    if (couponCode) {
      console.log('Coupon code provided:', couponCode)
    }
    if (actualCosts) {
      console.log(
        'Actual costs provided for Lindbergh coupon:',
        JSON.stringify(actualCosts, null, 2)
      )
      const totalShipping = Object.values(actualCosts).reduce(
        (sum: number, cost: any) => sum + cost.shippingCost,
        0
      )
      console.log('Total actual shipping cost:', totalShipping)
    }
    if (effectiveTotal) {
      console.log('Effective total provided:', effectiveTotal)
    }
    if (customerInfo) {
      console.log('Customer info provided for auto-fill:', {
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        email: customerInfo.email,
      })
    }

    // Check if cart contains only apparel and accessories for free shipping
    const hasOnlyApparelAndAccessories = items.every((item: any) => {
      const itemName = item.name.toLowerCase()
      const itemId = item.id.toLowerCase()

      // Check if it's apparel (contains shirt, tee, hoodie, tank, polo, etc.)
      const isApparel =
        itemName.includes('shirt') ||
        itemName.includes('tee') ||
        itemName.includes('hoodie') ||
        itemName.includes('tank') ||
        itemName.includes('polo') ||
        itemName.includes('swimsuit') ||
        itemName.includes('shorts') ||
        itemName.includes('wetsuit') ||
        itemId.includes('apparel') ||
        itemId.includes('shirt') ||
        itemId.includes('tee') ||
        itemId.includes('hoodie')

      // Check if it's accessories (hats, beanies, etc.)
      const isAccessory =
        itemName.includes('hat') ||
        itemName.includes('beanie') ||
        itemName.includes('cap') ||
        itemId.includes('accessories') ||
        itemId.includes('hat') ||
        itemId.includes('beanie')

      return isApparel || isAccessory
    })

    console.log('Has only apparel and accessories:', hasOnlyApparelAndAccessories)

    // Calculate subtotal for free shipping check
    const subtotal = items.reduce((total: number, item: any) => {
      return total + parseFloat(item.price.replace('$', '')) * item.quantity
    }, 0)

    console.log('Order subtotal:', subtotal)

    // Free shipping for orders over $50
    const qualifiesForFreeShipping = subtotal >= 50
    console.log('Qualifies for free shipping:', qualifiesForFreeShipping)

    // Calculate shipping for apparel and accessories
    const calculateApparelShipping = () => {
      if (!hasOnlyApparelAndAccessories) return 0

      const totalItems = items.reduce((total: number, item: any) => total + item.quantity, 0)
      if (totalItems === 0) return 0

      // First item is $5.44, each additional item is $2.77
      const firstItemCost = 5.44
      const additionalItemCost = 2.77
      const additionalItems = Math.max(0, totalItems - 1)

      return firstItemCost + additionalItems * additionalItemCost
    }

    // Check for free shipping coupons
    const freeShippingCoupon = couponCode === 'FREESHIP' || couponCode === 'SHIPFREE'
    if (freeShippingCoupon) {
      console.log('🚚 Free shipping coupon applied:', couponCode)
    }

    const apparelShippingCost =
      qualifiesForFreeShipping || freeShippingCoupon ? 0 : calculateApparelShipping()
    const gearShippingCost = qualifiesForFreeShipping || freeShippingCoupon ? 0 : 4.75

    console.log('Calculated apparel shipping cost:', apparelShippingCost)
    console.log('Calculated gear shipping cost:', gearShippingCost)

    // Convert cart items to Stripe line items
    const lineItems = items.map((item: any) => {
      let unitAmount = Math.round(parseFloat(item.price.replace('$', '')) * 100) // Convert to cents

      // Use actual costs for Lindbergh coupon
      if (couponCode === 'LINDBERGH-LAKE737' && actualCosts && actualCosts[item.id]) {
        const actualCost = actualCosts[item.id]
        // Calculate per-unit actual cost for production + tax only (shipping handled separately)
        const perUnitCost = (actualCost.productionCost + actualCost.taxCost) / item.quantity
        unitAmount = Math.round(perUnitCost * 100)
        console.log(
          `Using actual cost for ${item.name}: $${perUnitCost.toFixed(2)} per unit (production + tax)`
        )
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: couponCode === 'LINDBERGH-LAKE737' ? `${item.name} (Actual Cost)` : item.name,
            images: [
              item.image.startsWith('/')
                ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://muwaterwear.com'}${encodeURI(item.image)}`
                : item.image,
            ],
            metadata: {
              size: item.size || 'N/A',
              actualCost: couponCode === 'LINDBERGH-LAKE737' ? 'true' : 'false',
            },
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      }
    })

    console.log('Generated line items:', JSON.stringify(lineItems, null, 2))

    // Prepare session configuration
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://muwaterwear.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://muwaterwear.com'}`,
      automatic_tax: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'required',
      customer_creation: 'always',
      // Pre-fill customer email if provided
      ...(customerInfo && {
        customer_email: customerInfo.email,
      }),
      metadata: {
        order_type: 'waterwear',
        free_shipping: hasOnlyApparelAndAccessories ? 'true' : 'false',
        lindbergh_coupon: couponCode === 'LINDBERGH-LAKE737' ? 'true' : 'false',
        actual_costs_used: couponCode === 'LINDBERGH-LAKE737' && actualCosts ? 'true' : 'false',
        free_shipping_coupon: freeShippingCoupon ? 'true' : 'false',
        coupon_applied: couponCode || 'none',
        effective_total: effectiveTotal ? effectiveTotal.toString() : '',
        // Add customer info to metadata for order processing
        ...(customerInfo && {
          customer_first_name: customerInfo.firstName,
          customer_last_name: customerInfo.lastName,
          customer_email_prefill: customerInfo.email,
        }),
      },
      shipping_options:
        couponCode === 'LINDBERGH-LAKE737' && actualCosts
          ? [
              {
                // For Lindbergh coupon, use actual shipping costs
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: {
                    amount: Math.round(
                      Object.values(actualCosts).reduce(
                        (sum: number, cost: any) => sum + cost.shippingCost,
                        0
                      ) * 100
                    ),
                    currency: 'usd',
                  },
                  display_name: 'Actual Shipping Cost',
                  delivery_estimate: {
                    minimum: {
                      unit: 'business_day',
                      value: 3,
                    },
                    maximum: {
                      unit: 'business_day',
                      value: 7,
                    },
                  },
                },
              },
            ]
          : hasOnlyApparelAndAccessories
            ? [
                {
                  shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                      amount: Math.round(apparelShippingCost * 100), // Convert to cents
                      currency: 'usd',
                    },
                    display_name:
                      qualifiesForFreeShipping || freeShippingCoupon
                        ? freeShippingCoupon
                          ? 'Free Shipping (Coupon Applied)'
                          : 'Free Shipping'
                        : 'Apparel & Accessories Shipping',
                    delivery_estimate: {
                      minimum: {
                        unit: 'business_day',
                        value: 3,
                      },
                      maximum: {
                        unit: 'business_day',
                        value: 7,
                      },
                    },
                  },
                },
              ]
            : [
                {
                  shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                      amount: Math.round(gearShippingCost * 100), // Convert to cents
                      currency: 'usd',
                    },
                    display_name:
                      qualifiesForFreeShipping || freeShippingCoupon
                        ? freeShippingCoupon
                          ? 'Free Shipping (Coupon Applied)'
                          : 'Free Shipping'
                        : 'Standard Shipping',
                    delivery_estimate: {
                      minimum: {
                        unit: 'business_day',
                        value: 3,
                      },
                      maximum: {
                        unit: 'business_day',
                        value: 7,
                      },
                    },
                  },
                },
              ],
    }

    // Handle coupon codes
    if (couponCode) {
      // Skip Stripe validation for our custom free shipping coupons
      if (freeShippingCoupon) {
        console.log('✅ Free shipping coupon applied (frontend only):', couponCode)
        // Don't send to Stripe, we handle shipping cost reduction ourselves
      } else {
        // For other coupons, validate with Stripe
        try {
          const coupon = await stripe.coupons.retrieve(couponCode)

          if (coupon.valid) {
            sessionConfig.discounts = [
              {
                coupon: couponCode,
              },
            ]
            console.log('Applied Stripe coupon:', couponCode, coupon)
          } else {
            console.log('Invalid Stripe coupon:', couponCode)
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 })
          }
        } catch (couponError) {
          console.log('Stripe coupon not found:', couponCode)
          return NextResponse.json({ error: 'Coupon code not found' }, { status: 400 })
        }
      }
    } else {
      // Only enable general promotion codes if no specific coupon is provided
      sessionConfig.allow_promotion_codes = true
    }

    // Create Stripe checkout session (hosted)
    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({
      sessionId: session.id,
      appliedCoupon: couponCode || null,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      {
        error: 'Error creating checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
