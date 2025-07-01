// End-to-End Tests for MU Waterwear Checkout Flow
// Testing critical user journeys and purchase flows

describe('MU Waterwear Checkout Flow', () => {
  beforeEach(() => {
    // Visit homepage and prepare test environment
    cy.visit('/')
    
    // Clear any existing cart data
    cy.window().then((win) => {
      win.localStorage.removeItem('mu-cart-items')
      win.localStorage.removeItem('mu-user-profile')
    })
    
    // Mock Stripe for testing
    cy.window().then((win) => {
      win.Stripe = {
        redirectToCheckout: cy.stub().resolves()
      }
    })
  })

  describe('Product Discovery and Cart Addition', () => {
    it('should allow users to search for products and add to cart', () => {
      // Open search
      cy.get('[data-testid="search-trigger"]').click()
      
      // Search for a product
      cy.get('input[placeholder*="Search"]').type('Lake Tahoe')
      
      // Wait for search results
      cy.contains('Lake Tahoe Board Shorts', { timeout: 10000 }).should('be.visible')
      
      // Click on product
      cy.contains('Lake Tahoe Board Shorts').click()
      
      // Should navigate to product page
      cy.url().should('include', 'lake-tahoe')
      
      // Add product to cart
      cy.get('[data-testid="add-to-cart"]').first().click()
      
      // Verify cart notification
      cy.contains('Added to cart').should('be.visible')
      
      // Verify cart count updates
      cy.get('[data-testid="cart-count"]').should('contain', '1')
    })

    it('should handle product variants and quantities', () => {
      cy.visit('/lake-tahoe')
      
      // Select size
      cy.get('[data-testid="size-selector"]').first().click()
      cy.contains('Large').click()
      
      // Increase quantity
      cy.get('[data-testid="quantity-increase"]').click()
      cy.get('[data-testid="quantity-input"]').should('have.value', '2')
      
      // Add to cart
      cy.get('[data-testid="add-to-cart"]').click()
      
      // Verify cart contains correct items
      cy.get('[data-testid="cart-trigger"]').click()
      cy.contains('Large').should('be.visible')
      cy.contains('Quantity: 2').should('be.visible')
    })
  })

  describe('Shopping Cart Management', () => {
    beforeEach(() => {
      // Add items to cart for testing
      cy.visit('/lake-tahoe')
      cy.get('[data-testid="add-to-cart"]').first().click()
      cy.wait(1000) // Allow cart to update
    })

    it('should display cart items correctly', () => {
      cy.get('[data-testid="cart-trigger"]').click()
      
      // Verify cart sidebar opens
      cy.get('[data-testid="cart-sidebar"]').should('be.visible')
      
      // Verify product details
      cy.contains('Lake Tahoe Board Shorts').should('be.visible')
      cy.get('[data-testid="item-price"]').should('be.visible')
      cy.get('[data-testid="item-quantity"]').should('be.visible')
      
      // Verify total calculation
      cy.get('[data-testid="cart-total"]').should('be.visible')
    })

    it('should allow quantity updates in cart', () => {
      cy.get('[data-testid="cart-trigger"]').click()
      
      // Increase quantity
      cy.get('[data-testid="increase-quantity"]').first().click()
      
      // Verify quantity updated
      cy.get('[data-testid="item-quantity"]').should('contain', '2')
      
      // Verify total updated
      cy.get('[data-testid="cart-total"]').then(($total) => {
        const totalText = $total.text()
        expect(totalText).to.match(/\$\d+\.\d{2}/)
      })
    })

    it('should allow item removal from cart', () => {
      cy.get('[data-testid="cart-trigger"]').click()
      
      // Remove item
      cy.get('[data-testid="remove-item"]').first().click()
      
      // Verify confirmation dialog
      cy.contains('Remove item').should('be.visible')
      cy.get('[data-testid="confirm-remove"]').click()
      
      // Verify item removed
      cy.contains('Your cart is empty').should('be.visible')
      cy.get('[data-testid="cart-count"]').should('contain', '0')
    })

    it('should handle cart errors gracefully', () => {
      // Simulate storage error
      cy.window().then((win) => {
        cy.stub(win.Storage.prototype, 'setItem').throws('Storage error')
      })
      
      cy.visit('/lake-tahoe')
      cy.get('[data-testid="add-to-cart"]').first().click()
      
      // Should show error notification
      cy.get('[data-testid="cart-error"]').should('be.visible')
      cy.contains('retry').should('be.visible')
    })
  })

  describe('User Profile and Checkout', () => {
    it('should guide user through profile creation', () => {
      // Add item to cart
      cy.visit('/lake-tahoe')
      cy.get('[data-testid="add-to-cart"]').first().click()
      
      // Go to checkout
      cy.get('[data-testid="cart-trigger"]').click()
      cy.get('[data-testid="checkout-button"]').click()
      
      // Should show profile form for new users
      cy.contains('Enter your details').should('be.visible')
      
      // Fill out user information
      cy.get('[data-testid="first-name"]').type('John')
      cy.get('[data-testid="last-name"]').type('Doe')
      cy.get('[data-testid="email"]').type('john.doe@example.com')
      cy.get('[data-testid="phone"]').type('555-123-4567')
      
      // Fill shipping address
      cy.get('[data-testid="address"]').type('123 Lake Street')
      cy.get('[data-testid="city"]').type('Lake City')
      cy.get('[data-testid="state"]').type('CA')
      cy.get('[data-testid="zip"]').type('90210')
      
      // Continue to payment
      cy.get('[data-testid="continue-to-payment"]').click()
      
      // Should redirect to Stripe (mocked)
      cy.window().its('Stripe.redirectToCheckout').should('have.been.called')
    })

    it('should handle existing user profiles', () => {
      // Set up existing user profile
      cy.window().then((win) => {
        const userProfile = {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '555-987-6543',
          shippingAddresses: [{
            name: 'Jane Smith',
            address: '456 Ocean Ave',
            city: 'Beach City',
            state: 'FL',
            zip: '33101'
          }]
        }
        win.localStorage.setItem('mu-user-profile', JSON.stringify(userProfile))
      })
      
      // Add item and checkout
      cy.visit('/lake-tahoe')
      cy.get('[data-testid="add-to-cart"]').first().click()
      cy.get('[data-testid="cart-trigger"]').click()
      cy.get('[data-testid="checkout-button"]').click()
      
      // Should show existing profile data
      cy.get('[data-testid="first-name"]').should('have.value', 'Jane')
      cy.get('[data-testid="email"]').should('have.value', 'jane.smith@example.com')
      
      // Should be able to proceed quickly
      cy.get('[data-testid="continue-to-payment"]').click()
      cy.window().its('Stripe.redirectToCheckout').should('have.been.called')
    })

    it('should validate required fields', () => {
      cy.visit('/lake-tahoe')
      cy.get('[data-testid="add-to-cart"]').first().click()
      cy.get('[data-testid="cart-trigger"]').click()
      cy.get('[data-testid="checkout-button"]').click()
      
      // Try to continue without filling required fields
      cy.get('[data-testid="continue-to-payment"]').click()
      
      // Should show validation errors
      cy.contains('First name is required').should('be.visible')
      cy.contains('Email is required').should('be.visible')
      cy.contains('Address is required').should('be.visible')
    })
  })

  describe('Order Completion Flow', () => {
    it('should handle successful order completion', () => {
      // Simulate successful payment redirect
      cy.visit('/success?session_id=test_session_123')
      
      // Should show success message
      cy.contains('Order Confirmed!').should('be.visible')
      cy.contains('#TEST_SES').should('be.visible') // Last 8 chars of session_id
      
      // Should show order details
      cy.contains('Order Details').should('be.visible')
      cy.contains('Built for water. Forged for legends.').should('be.visible')
      
      // Should have action buttons
      cy.contains('Continue Shopping').should('be.visible')
      cy.contains('Learn More About MU Waterwear').should('be.visible')
    })

    it('should save order to user profile', () => {
      // Set up user profile and cart data
      cy.window().then((win) => {
        const userProfile = {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          orderHistory: []
        }
        const cartData = [{
          name: 'Lake Tahoe Board Shorts',
          price: '$89.99',
          quantity: 1,
          size: 'Large'
        }]
        
        win.localStorage.setItem('mu-user-profile', JSON.stringify(userProfile))
        win.localStorage.setItem('checkout-cart-data', JSON.stringify(cartData))
        win.localStorage.setItem('checkout-order-total', '89.99')
      })
      
      cy.visit('/success?session_id=test_session_456')
      
      // Wait for order processing
      cy.wait(2000)
      
      // Verify order saved to profile
      cy.window().then((win) => {
        const profile = JSON.parse(win.localStorage.getItem('mu-user-profile'))
        expect(profile.orderHistory).to.have.length(1)
        expect(profile.orderHistory[0].orderId).to.equal('TEST_SES')
      })
    })

    it('should clear cart after successful order', () => {
      // Set up cart with items
      cy.window().then((win) => {
        const cartItems = [{ id: '1', name: 'Test Item', quantity: 1 }]
        win.localStorage.setItem('mu-cart-items', JSON.stringify(cartItems))
      })
      
      cy.visit('/success?session_id=test_session_789')
      
      // Wait for order processing
      cy.wait(2000)
      
      // Cart should be cleared
      cy.get('[data-testid="cart-count"]').should('contain', '0')
    })

    it('should handle missing session ID gracefully', () => {
      cy.visit('/success')
      
      // Should still show success page but without order details
      cy.contains('Order Confirmed!').should('be.visible')
      
      // Should not crash the application
      cy.get('body').should('exist')
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors during checkout', () => {
      // Intercept and fail API calls
      cy.intercept('POST', '**/create-checkout-session', { forceNetworkError: true })
      
      cy.visit('/lake-tahoe')
      cy.get('[data-testid="add-to-cart"]').first().click()
      cy.get('[data-testid="cart-trigger"]').click()
      cy.get('[data-testid="checkout-button"]').click()
      
      // Fill form
      cy.get('[data-testid="first-name"]').type('Test')
      cy.get('[data-testid="email"]').type('test@example.com')
      cy.get('[data-testid="continue-to-payment"]').click()
      
      // Should show error message
      cy.contains('network error', { matchCase: false }).should('be.visible')
    })

    it('should handle local storage failures', () => {
      // Mock localStorage failure
      cy.window().then((win) => {
        cy.stub(win.Storage.prototype, 'getItem').throws('Storage not available')
      })
      
      cy.visit('/')
      
      // Application should still load
      cy.contains('MU Waterwear').should('be.visible')
      
      // Should show fallback behavior
      cy.get('[data-testid="cart-count"]').should('contain', '0')
    })

    it('should maintain cart state across page refreshes', () => {
      cy.visit('/lake-tahoe')
      cy.get('[data-testid="add-to-cart"]').first().click()
      
      // Verify item in cart
      cy.get('[data-testid="cart-count"]').should('contain', '1')
      
      // Refresh page
      cy.reload()
      
      // Cart should persist
      cy.get('[data-testid="cart-count"]').should('contain', '1')
      cy.get('[data-testid="cart-trigger"]').click()
      cy.contains('Lake Tahoe Board Shorts').should('be.visible')
    })
  })

  describe('Accessibility Testing', () => {
    it('should be keyboard navigable', () => {
      cy.visit('/')
      
      // Tab through main navigation
      cy.get('body').tab()
      cy.focused().should('have.attr', 'href')
      
      // Continue tabbing to search
      cy.focused().tab()
      cy.focused().tab()
      
      // Should be able to open search with Enter
      cy.focused().type('{enter}')
      cy.get('input[placeholder*="Search"]').should('be.visible')
    })

    it('should have proper ARIA labels', () => {
      cy.visit('/lake-tahoe')
      
      // Check for important ARIA labels
      cy.get('[data-testid="add-to-cart"]').should('have.attr', 'aria-label')
      cy.get('[data-testid="cart-trigger"]').should('have.attr', 'aria-label')
      
      // Check for proper heading structure
      cy.get('h1').should('exist')
      cy.get('h2').should('exist')
    })

    it('should work with screen reader announcements', () => {
      cy.visit('/lake-tahoe')
      cy.get('[data-testid="add-to-cart"]').first().click()
      
      // Should have aria-live region for announcements
      cy.get('[aria-live]').should('exist')
    })
  })

  describe('Performance Testing', () => {
    it('should load pages within acceptable time', () => {
      const startTime = Date.now()
      
      cy.visit('/')
      
      cy.window().then(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(3000) // 3 seconds max
      })
    })

    it('should handle large cart quantities efficiently', () => {
      cy.visit('/lake-tahoe')
      
      // Add multiple items quickly
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="add-to-cart"]').first().click()
        cy.wait(100)
      }
      
      // Cart should still be responsive
      cy.get('[data-testid="cart-trigger"]').click()
      cy.get('[data-testid="cart-sidebar"]').should('be.visible')
      cy.get('[data-testid="cart-count"]').should('contain', '5')
    })
  })
})

// Test utilities and custom commands
Cypress.Commands.add('tab', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).trigger('keydown', { keyCode: 9 })
})

declare global {
  namespace Cypress {
    interface Chainable {
      tab(): Chainable<Element>
    }
  }
} 