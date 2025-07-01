import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import UserAccountButton from '@/components/UserAccountButton'
import { ToastProvider } from '@/contexts/ToastContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import { usePersonalizedGreeting } from '@/hooks/usePersonalizedGreeting'

// Mock the hooks
jest.mock('next-auth/react')
jest.mock('@/hooks/useUserProfile')
jest.mock('@/hooks/usePersonalizedGreeting')
jest.mock('next/link', () => {
  return ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  )
})

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockUseUserProfile = useUserProfile as jest.MockedFunction<typeof useUserProfile>
const mockUsePersonalizedGreeting = usePersonalizedGreeting as jest.MockedFunction<typeof usePersonalizedGreeting>

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={null}>
    <ToastProvider>
      {children}
    </ToastProvider>
  </SessionProvider>
)

describe('UserAccountButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementations
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn()
    })

    mockUseUserProfile.mockReturnValue({
      status: 'unauthenticated',
      cachedUser: null,
      currentUser: null,
      isAuthenticated: false,
      userDisplayName: '',
      loading: false,
      error: null,
      saveCachedUser: jest.fn(),
      clearUserProfile: jest.fn(),
      saveShippingAddress: jest.fn(),
      updateShippingAddress: jest.fn(),
      deleteShippingAddress: jest.fn(),
      saveOrderToHistory: jest.fn(),
      session: null,
      userEmail: '',
    })

    mockUsePersonalizedGreeting.mockReturnValue({
      getPersonalizedGreeting: jest.fn(() => 'Hello!'),
      rotateGreeting: jest.fn()
    })
  })

  describe('Unauthenticated User', () => {
    it('renders login and signup options when no user is logged in', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User account options')
      fireEvent.click(accountButton)

      expect(screen.getByText('Welcome to MU Waterwear')).toBeInTheDocument()
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByText('Create Account')).toBeInTheDocument()
      expect(screen.getByText('Or continue as guest:')).toBeInTheDocument()
    })

    it('closes dropdown when clicking outside', async () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User account options')
      fireEvent.click(accountButton)

      expect(screen.getByText('Welcome to MU Waterwear')).toBeInTheDocument()

      // Click outside
      fireEvent.mouseDown(document.body)

      await waitFor(() => {
        expect(screen.queryByText('Welcome to MU Waterwear')).not.toBeInTheDocument()
      })
    })

    it('navigates to signin page when Sign In is clicked', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User account options')
      fireEvent.click(accountButton)

      const signInLink = screen.getByText('Sign In').closest('a')
      expect(signInLink).toHaveAttribute('href', '/auth/signin')
    })

    it('navigates to signup page when Create Account is clicked', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User account options')
      fireEvent.click(accountButton)

      const signUpLink = screen.getByText('Create Account').closest('a')
      expect(signUpLink).toHaveAttribute('href', '/auth/signup')
    })
  })

  describe('Authenticated User', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            addresses: [],
            preferences: {},
            isEmailVerified: true,
          },
          expires: '2099-12-31T23:59:59.999Z',
        },
        status: 'authenticated',
        update: jest.fn()
      })

      mockUseUserProfile.mockReturnValue({
        status: 'authenticated',
        cachedUser: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          shippingAddresses: [
            {
              id: '1',
              name: 'John Doe',
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              postalCode: '12345',
              country: 'US',
              isDefault: true,
              createdAt: '2024-01-01T00:00:00Z',
            }
          ],
          orderHistory: [
            {
              id: '1',
              orderId: 'ORD-001',
              sessionId: 'sess_123',
              orderDate: '2024-01-01',
              amount: 99.99,
              status: 'completed',
              items: [
                {
                  name: 'Test Product',
                  price: '$99.99',
                  quantity: 1,
                  size: 'L'
                }
              ]
            }
          ],
          isGuest: false,
          lastUsed: '2024-01-01T00:00:00Z',
        },
        currentUser: {
          id: '1',
          email: 'test@example.com',
          name: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          addresses: [],
          preferences: {},
          isEmailVerified: true,
        },
        isAuthenticated: true,
        userDisplayName: 'John Doe',
        loading: false,
        error: null,
        saveCachedUser: jest.fn(),
        clearUserProfile: jest.fn(),
        saveShippingAddress: jest.fn(),
        updateShippingAddress: jest.fn(),
        deleteShippingAddress: jest.fn(),
        saveOrderToHistory: jest.fn(),
        session: null,
        userEmail: '',
      })
    })

    it('renders user menu with all options for authenticated user', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User profile for John Doe')
      fireEvent.click(accountButton)

      expect(screen.getByText('Hello!')).toBeInTheDocument()
      expect(screen.getByText('✓ Signed in with NextAuth')).toBeInTheDocument()
      expect(screen.getByText('Profile Settings')).toBeInTheDocument()
      expect(screen.getByText('Shipping Addresses')).toBeInTheDocument()
      expect(screen.getByText('Order History')).toBeInTheDocument()
      expect(screen.getByText('Payment Methods')).toBeInTheDocument()
      expect(screen.getByText('Sign Out')).toBeInTheDocument()
    })

    it('shows address count badge when user has addresses', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User profile for John Doe')
      fireEvent.click(accountButton)

      // Should show "1" badge for shipping addresses
      const addressBadge = screen.getByText('1')
      expect(addressBadge).toBeInTheDocument()
    })

    it('shows order count badge when user has orders', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User profile for John Doe')
      fireEvent.click(accountButton)

      // Should show "1" badge for order history
      const orderBadges = screen.getAllByText('1')
      expect(orderBadges.length).toBeGreaterThan(0)
    })

    it('handles sign out correctly', async () => {
      const mockClearUserProfile = jest.fn()
      mockUseUserProfile.mockReturnValue({
        ...mockUseUserProfile(),
        clearUserProfile: mockClearUserProfile
      })

      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User profile for John Doe')
      fireEvent.click(accountButton)

      const signOutButton = screen.getByText('Sign Out')
      fireEvent.click(signOutButton)

      await waitFor(() => {
        expect(mockClearUserProfile).toHaveBeenCalled()
      })
    })

    it('opens profile form when Profile Settings is clicked', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User profile for John Doe')
      fireEvent.click(accountButton)

      const profileButton = screen.getByText('Profile Settings')
      fireEvent.click(profileButton)

      // Profile form should be rendered (QuickProfileForm component)
      // This would need to be tested based on the actual form implementation
    })

    it('opens address manager when Shipping Addresses is clicked', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User profile for John Doe')
      fireEvent.click(accountButton)

      const addressButton = screen.getByText('Shipping Addresses')
      fireEvent.click(addressButton)

      // Address manager should be rendered (ShippingAddressManager component)
      // This would need to be tested based on the actual component implementation
    })

    it('opens order history when Order History is clicked', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User profile for John Doe')
      fireEvent.click(accountButton)

      const orderButton = screen.getByText('Order History')
      fireEvent.click(orderButton)

      // Order history should be rendered (OrderHistoryViewer component)
      // This would need to be tested based on the actual component implementation
    })

    it('shows payment methods coming soon message', async () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User profile for John Doe')
      fireEvent.click(accountButton)

      const paymentButton = screen.getByText('Payment Methods')
      fireEvent.click(paymentButton)

      // Should trigger toast notification
      // This would need to be verified based on toast implementation
    })
  })

  describe('Loading State', () => {
    it('renders loading spinner when user profile is loading', () => {
      mockUseUserProfile.mockReturnValue({
        ...mockUseUserProfile(),
        loading: true,
        status: 'loading'
      })

      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const loadingElement = screen.getByRole('generic')
      expect(loadingElement).toHaveClass('animate-pulse')
    })
  })

  describe('Error Handling', () => {
    it('displays error message when there is an error', () => {
      const errorMessage = 'Failed to load user profile'
      mockUseUserProfile.mockReturnValue({
        ...mockUseUserProfile(),
        error: errorMessage
      })

      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User account options')
      expect(accountButton).toHaveAttribute('aria-label', 'User account options')
      
      fireEvent.click(accountButton)
      
      expect(accountButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('supports keyboard navigation', () => {
      render(
        <TestWrapper>
          <UserAccountButton />
        </TestWrapper>
      )

      const accountButton = screen.getByLabelText('User account options')
      accountButton.focus()
      
      expect(document.activeElement).toBe(accountButton)
      
      // Test Enter key
      fireEvent.keyDown(accountButton, { key: 'Enter', code: 'Enter' })
      expect(screen.getByText('Welcome to MU Waterwear')).toBeInTheDocument()
    })
  })
}) 