import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    orders: []
  }),

  getters: {
    cartItems: (state) => state.items,
    cartTotal: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    cartItemCount: (state) => {
      return state.items.reduce((count, item) => count + item.quantity, 0)
    },
    userOrders: (state) => state.orders
  },

  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.items.push({
          ...product,
          quantity: 1
        })
      }
      
      Swal.fire({
        title: '¡Agregado!',
        text: `${product.name} agregado al carrito`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
      })
    },

    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
        
        Swal.fire({
          title: 'Eliminado',
          text: 'Producto eliminado del carrito',
          icon: 'info',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        })
      }
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = quantity
        }
      }
    },

    clearCart() {
      this.items = []
    },

    async checkout(orderData) {
      try {
        const order = {
          id: Date.now(),
          items: [...this.items],
          total: this.cartTotal,
          status: 'pending',
          date: new Date().toISOString(),
          customerInfo: orderData,
          estimatedTime: '15-20 minutos'
        }
        
        this.orders.push(order)
        this.clearCart()
        
        Swal.fire({
          title: '¡Pedido realizado!',
          text: `Tu pedido #${order.id} ha sido confirmado`,
          icon: 'success',
          confirmButtonText: 'Ver estado del pedido'
        })
        
        return { success: true, orderId: order.id }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Error al procesar el pedido',
          icon: 'error'
        })
        return { success: false, error: error.message }
      }
    },

    updateOrderStatus(orderId, status) {
      const order = this.orders.find(order => order.id === orderId)
      if (order) {
        order.status = status
        
        const statusMessages = {
          'confirmed': 'Tu pedido ha sido confirmado',
          'preparing': 'Tu pedido está siendo preparado',
          'ready': 'Tu pedido está listo para recoger',
          'completed': 'Tu pedido ha sido completado'
        }
        
        Swal.fire({
          title: 'Estado actualizado',
          text: statusMessages[status],
          icon: 'info',
          timer: 3000,
          showConfirmButton: false
        })
      }
    }
  }
})

