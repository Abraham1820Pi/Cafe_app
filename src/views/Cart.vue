<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-shopping-cart"></i> Mi Carrito</h1>
        <p v-if="cartItems.length > 0">Revisa tu pedido antes de continuar</p>
      </div>

      <!-- Carrito vacío -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <i class="fas fa-shopping-cart"></i>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos productos deliciosos para comenzar tu pedido</p>
          <router-link to="/products" class="btn btn-primary">
            <i class="fas fa-coffee"></i>
            Ver Productos
          </router-link>
        </div>
      </div>

      <!-- Carrito con productos -->
      <div v-else class="cart-content">
        <div class="cart-items-section">
          <div class="cart-items">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item"
            >
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              
              <div class="item-info">
                <h4 class="item-name">{{ item.name }}</h4>
                <p class="item-description">{{ item.description }}</p>
                <div class="item-price">
                  ${{ (item.price / 100).toFixed(2) }} c/u
                </div>
              </div>
              
              <div class="item-controls">
                <div class="quantity-controls">
                  <button
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    class="quantity-btn"
                    :disabled="item.quantity <= 1"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    :value="item.quantity"
                    @input="updateQuantity(item.id, parseInt($event.target.value))"
                    class="quantity-input"
                    min="1"
                  />
                  <button
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    class="quantity-btn"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                
                <div class="item-total">
                  ${{ ((item.price * item.quantity) / 100).toFixed(2) }}
                </div>
                
                <button
                  @click="removeItem(item.id)"
                  class="remove-btn"
                  title="Eliminar producto"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del pedido -->
        <div class="order-summary">
          <div class="summary-card">
            <h3><i class="fas fa-receipt"></i> Resumen del Pedido</h3>
            
            <div class="summary-details">
              <div class="summary-row">
                <span>Subtotal ({{ cartItemCount }} productos)</span>
                <span>${{ (cartTotal / 100).toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>Impuestos</span>
                <span>${{ (taxes / 100).toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>Descuento de fidelidad</span>
                <span class="discount">-${{ (loyaltyDiscount / 100).toFixed(2) }}</span>
              </div>
              
              <div class="summary-divider"></div>
              
              <div class="summary-row total-row">
                <span>Total</span>
                <span>${{ (finalTotal / 100).toFixed(2) }}</span>
              </div>
            </div>
            
            <!-- Puntos de fidelidad -->
            <div class="loyalty-info">
              <div class="loyalty-points">
                <i class="fas fa-star"></i>
                Ganarás {{ pointsToEarn }} puntos con esta compra
              </div>
            </div>
            
            <!-- Botones de acción -->
            <div class="action-buttons">
              <button @click="clearCart" class="btn btn-outline">
                <i class="fas fa-trash"></i>
                Vaciar Carrito
              </button>
              
              <button @click="proceedToCheckout" class="btn btn-primary btn-large">
                <i class="fas fa-credit-card"></i>
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de checkout -->
    <div v-if="showCheckoutModal" class="modal-overlay" @click="closeCheckoutModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-credit-card"></i> Finalizar Pedido</h3>
          <button @click="closeCheckoutModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="submitOrder" class="checkout-form">
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-user"></i>
              Nombre completo
            </label>
            <input
              type="text"
              v-model="orderForm.customerName"
              class="form-control"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-phone"></i>
              Teléfono
            </label>
            <input
              type="tel"
              v-model="orderForm.customerPhone"
              class="form-control"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-sticky-note"></i>
              Notas especiales (opcional)
            </label>
            <textarea
              v-model="orderForm.notes"
              class="form-control"
              rows="3"
              placeholder="Instrucciones especiales para tu pedido..."
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-credit-card"></i>
              Método de pago
            </label>
            <select v-model="orderForm.paymentMethod" class="form-control" required>
              <option value="">Selecciona un método</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta de crédito/débito</option>
              <option value="transfer">Transferencia bancaria</option>
            </select>
          </div>
          
          <div class="checkout-summary">
            <div class="summary-row">
              <span>Total a pagar:</span>
              <span class="total-amount">${{ (finalTotal / 100).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeCheckoutModal" class="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" class="btn btn-success" :disabled="submittingOrder">
              <i v-if="submittingOrder" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-check"></i>
              {{ submittingOrder ? 'Procesando...' : 'Confirmar Pedido' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useLoyaltyStore } from '@/stores/loyalty'
import Swal from 'sweetalert2'

export default {
  name: 'Cart',
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const loyaltyStore = useLoyaltyStore()
    
    const showCheckoutModal = ref(false)
    const submittingOrder = ref(false)
    
    const orderForm = ref({
      customerName: authStore.user?.name || '',
      customerPhone: '',
      notes: '',
      paymentMethod: ''
    })
    
    const cartItems = computed(() => cartStore.cartItems)
    const cartItemCount = computed(() => cartStore.cartItemCount)
    const cartTotal = computed(() => cartStore.cartTotal)
    
    const taxes = computed(() => Math.round(cartTotal.value * 0.1)) // 10% impuestos
    const loyaltyDiscount = computed(() => {
      // Descuento del 5% si tiene más de 100 puntos
      const user = authStore.user
      if (user && user.loyaltyPoints > 100) {
        return Math.round(cartTotal.value * 0.05)
      }
      return 0
    })
    
    const finalTotal = computed(() => cartTotal.value + taxes.value - loyaltyDiscount.value)
    const pointsToEarn = computed(() => loyaltyStore.calculatePointsFromPurchase(finalTotal.value))
    
    const updateQuantity = (productId, quantity) => {
      cartStore.updateQuantity(productId, quantity)
    }
    
    const removeItem = (productId) => {
      Swal.fire({
        title: '¿Eliminar producto?',
        text: 'Este producto será removido de tu carrito',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if (result.isConfirmed) {
          cartStore.removeFromCart(productId)
        }
      })
    }
    
    const clearCart = () => {
      Swal.fire({
        title: '¿Vaciar carrito?',
        text: 'Se eliminarán todos los productos del carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if (result.isConfirmed) {
          cartStore.clearCart()
        }
      })
    }
    
    const proceedToCheckout = () => {
      showCheckoutModal.value = true
    }
    
    const closeCheckoutModal = () => {
      showCheckoutModal.value = false
    }
    
    const submitOrder = async () => {
      submittingOrder.value = true
      
      try {
        const result = await cartStore.checkout(orderForm.value)
        
        if (result.success) {
          // Agregar puntos de fidelidad
          loyaltyStore.addPoints(pointsToEarn.value, 'compra realizada')
          
          showCheckoutModal.value = false
          router.push(`/order-status/${result.orderId}`)
        }
      } catch (error) {
        console.error('Error al procesar pedido:', error)
      } finally {
        submittingOrder.value = false
      }
    }
    
    return {
      cartItems,
      cartItemCount,
      cartTotal,
      taxes,
      loyaltyDiscount,
      finalTotal,
      pointsToEarn,
      showCheckoutModal,
      submittingOrder,
      orderForm,
      updateQuantity,
      removeItem,
      clearCart,
      proceedToCheckout,
      closeCheckoutModal,
      submitOrder
    }
  }
}
</script>

<style scoped>
.cart-page {
  padding: 2rem 0;
  min-height: calc(100vh - 140px);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

/* Carrito vacío */
.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-cart-content {
  text-align: center;
  max-width: 400px;
}

.empty-cart-content i {
  font-size: 5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.empty-cart-content h3 {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.empty-cart-content p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Carrito con productos */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
}

.cart-items {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.item-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-price {
  color: var(--secondary-color);
  font-weight: 500;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.quantity-btn:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: var(--white);
  border-color: var(--primary-color);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  padding: 0.5rem;
}

.item-total {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--secondary-color);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.remove-btn:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

/* Resumen del pedido */
.summary-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  position: sticky;
  top: 2rem;
}

.summary-card h3 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-details {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-row.total-row {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.discount {
  color: var(--success);
  font-weight: 500;
}

.summary-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 1rem 0;
}

.loyalty-info {
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(210, 105, 30, 0.1));
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.loyalty-points {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 500;
}

.loyalty-points i {
  color: #ffc107;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-large {
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--white);
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  color: var(--primary-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.close-btn:hover {
  background-color: #f8f9fa;
}

.checkout-form {
  padding: 1.5rem;
}

.checkout-summary {
  background: var(--light-bg);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .cart-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .item-controls {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>

