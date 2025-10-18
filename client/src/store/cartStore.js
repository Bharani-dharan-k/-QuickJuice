import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as cartAPI from '@/api/cart.api'
import toast from 'react-hot-toast'

/**
 * Cart Store
 * Manages shopping cart state with optimistic UI updates
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      itemCount: 0,
      coupon: null,
      isLoading: false,

      // Actions
      setCart: (cart) => set({
        items: cart.items || [],
        subtotal: cart.subtotal || 0,
        discount: cart.discountAmount || 0,
        total: cart.total || 0,
        itemCount: cart.itemCount || 0,
        coupon: cart.coupon || null,
      }),

      /**
       * Add item to cart with optimistic UI
       */
      addItem: async (item) => {
        const { productId, variantId, quantity = 1 } = item

        try {
          // API call (skip optimistic update to avoid structure mismatch)
          const response = await cartAPI.addToCart(item)
          get().setCart(response.data)
        } catch (error) {
          // Handle errors
          if (error.status === 401) {
            toast.error('Please login to add items to cart')
          } else {
            toast.error(error.message || 'Failed to add item to cart')
          }
          throw error // Re-throw to let caller handle it
        }
      },

      /**
       * Update item quantity
       */
      updateItem: async (itemId, quantity) => {
        // Optimistic update
        const previousItems = get().items
        set((state) => ({
          items: state.items.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          ),
        }))

        try {
          const response = await cartAPI.updateCartItem(itemId, quantity)
          get().setCart(response.data)
        } catch (error) {
          // Revert on error
          set({ items: previousItems })
          toast.error(error.message || 'Failed to update item')
        }
      },

      /**
       * Remove item from cart
       */
      removeItem: async (itemId) => {
        // Optimistic update
        const previousItems = get().items
        set((state) => ({
          items: state.items.filter((item) => item._id !== itemId),
        }))

        try {
          const response = await cartAPI.removeFromCart(itemId)
          get().setCart(response.data)
          toast.success('Item removed from cart')
        } catch (error) {
          // Revert on error
          set({ items: previousItems })
          toast.error(error.message || 'Failed to remove item')
        }
      },

      /**
       * Clear entire cart
       */
      clearCart: async () => {
        try {
          await cartAPI.clearCart()
          set({
            items: [],
            subtotal: 0,
            discount: 0,
            total: 0,
            itemCount: 0,
            coupon: null,
          })
          toast.success('Cart cleared')
        } catch (error) {
          toast.error(error.message || 'Failed to clear cart')
        }
      },

      /**
       * Apply coupon code
       */
      applyCoupon: async (code) => {
        try {
          const response = await cartAPI.applyCoupon(code)
          get().setCart(response.data)
          toast.success('Coupon applied!')
        } catch (error) {
          toast.error(error.message || 'Invalid coupon code')
        }
      },

      /**
       * Remove coupon
       */
      removeCoupon: async () => {
        try {
          const response = await cartAPI.removeCoupon()
          get().setCart(response.data)
          toast.success('Coupon removed')
        } catch (error) {
          toast.error(error.message || 'Failed to remove coupon')
        }
      },

      /**
       * Fetch cart from server
       */
      fetchCart: async () => {
        set({ isLoading: true })
        try {
          const response = await cartAPI.getCart()
          get().setCart(response.data)
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          console.error('Failed to fetch cart:', error)
          toast.error(error.message || 'Failed to fetch cart')
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
)
