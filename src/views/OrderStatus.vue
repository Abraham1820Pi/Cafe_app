<template>
  <div class="order-status-page">
    <div class="container">
      <div v-if="!order" class="order-not-found">
        <i class="fas fa-search"></i>
        <h3>Pedido no encontrado</h3>
        <p>No se pudo encontrar el pedido solicitado</p>
        <router-link to="/orders" class="btn btn-primary">
          <i class="fas fa-list"></i>
          Ver Mis Pedidos
        </router-link>
      </div>

      <div v-else class="order-details">
        <!-- Header del pedido -->
        <div class="order-header">
          <div class="order-info">
            <h1>
              <i class="fas fa-receipt"></i>
              Pedido #{{ order.id }}
            </h1>
            <p class="order-date">
              Realizado el {{ formatDate(order.date) }}
            </p>
          </div>
          
          <div class="order-status-badge">
            <span :class="['status-badge', `status-${order.status}`]">
              <i :class="getStatusIcon(order.status)"></i>
              {{ getStatusText(order.status) }}
            </span>
          </div>
        </div>

        <!-- Progreso del pedido -->
        <div class="order-progress">
          <div class="progress-container">
            <div class="progress-steps">
              <div
                v-for="(step, index) in orderSteps"
                :key="step.status"
                :class="['progress-step', { 
                  active: isStepActive(step.status), 
                  completed: isStepCompleted(step.status) 
                }]"
              >
                <div class="step-icon">
                  <i :class="step.icon"></i>
                </div>
                <div class="step-info">
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                </div>
              </div>
            </div>
            <div class="progress-line" :style="{ width: progressWidth }"></div>
          </div>
        </div>

        <!-- Información del pedido -->
        <div class="order-content">
          <div class="order-items-section">
            <div class="section-card">
              <h3><i class="fas fa-shopping-bag"></i> Productos</h3>
              <div class="order-items">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="order-item"
                >
                  <img :src="item.image" :alt="item.name" class="item-image" />
                  <div class="item-details">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.description }}</p>
                    <div class="item-price-qty">
                      <span class="quantity">Cantidad: {{ item.quantity }}</span>
                      <span class="price">${{ (item.price / 1000).toFixed(3) }} c/u</span>
                    </div>
                  </div>
                  <div class="item-total">
                    ${{ ((item.price * item.quantity) / 1000).toFixed(3) }}
                  </div>
                </div>
              </div>
              
              <div class="order-total">
                <div class="total-row">
                  <span>Total del pedido:</span>
                  <span class="total-amount">${{ (order.total / 1000).toFixed(3) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="order-info-section">
            <!-- Información de entrega -->
            <div class="section-card">
              <h3><i class="fas fa-clock"></i> Tiempo Estimado</h3>
              <div class="delivery-info">
                <div class="estimated-time">
                  <span class="time-value">{{ order.estimatedTime }}</span>
                  <span class="time-label">tiempo estimado</span>
                </div>
                <p class="delivery-note">
                  Te notificaremos cuando tu pedido esté listo para recoger
                </p>
              </div>
            </div>

            <!-- Información del cliente -->
            <div class="section-card">
              <h3><i class="fas fa-user"></i> Información del Cliente</h3>
              <div class="customer-info">
                <div class="info-row">
                  <span class="info-label">Nombre:</span>
                  <span>{{ order.customerInfo.customerName }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Teléfono:</span>
                  <span>{{ order.customerInfo.customerPhone }}</span>
                </div>
                <div v-if="order.customerInfo.notes" class="info-row">
                  <span class="info-label">Notas:</span>
                  <span>{{ order.customerInfo.notes }}</span>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="section-card">
              <h3><i class="fas fa-cogs"></i> Acciones</h3>
              <div class="order-actions">
                <button
                  v-if="order.status === 'pending'"
                  @click="cancelOrder"
                  class="btn btn-outline btn-danger"
                >
                  <i class="fas fa-times"></i>
                  Cancelar Pedido
                </button>
                
                <button
                  @click="simulateStatusUpdate"
                  class="btn btn-secondary"
                  v-if="order.status !== 'completed'"
                >
                  <i class="fas fa-forward"></i>
                  Simular Avance (Demo)
                </button>
                
                <router-link to="/orders" class="btn btn-primary">
                  <i class="fas fa-list"></i>
                  Ver Todos los Pedidos
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import Swal from 'sweetalert2'

export default {
  name: 'OrderStatus',
  setup() {
    const route = useRoute()
    const cartStore = useCartStore()
    
    const order = ref(null)
    
    const orderSteps = [
      {
        status: 'pending',
        title: 'Pedido Recibido',
        description: 'Tu pedido ha sido recibido',
        icon: 'fas fa-check-circle'
      },
      {
        status: 'confirmed',
        title: 'Confirmado',
        description: 'Pedido confirmado y en preparación',
        icon: 'fas fa-thumbs-up'
      },
      {
        status: 'preparing',
        title: 'Preparando',
        description: 'Estamos preparando tu pedido',
        icon: 'fas fa-utensils'
      },
      {
        status: 'ready',
        title: 'Listo',
        description: 'Tu pedido está listo para recoger',
        icon: 'fas fa-bell'
      },
      {
        status: 'completed',
        title: 'Completado',
        description: 'Pedido entregado exitosamente',
        icon: 'fas fa-star'
      }
    ]
    
    const progressWidth = computed(() => {
      if (!order.value) return '0%'
      
      const currentIndex = orderSteps.findIndex(step => step.status === order.value.status)
      const percentage = ((currentIndex + 1) / orderSteps.length) * 100
      return `${percentage}%`
    })
    
    const isStepActive = (stepStatus) => {
      return order.value && order.value.status === stepStatus
    }
    
    const isStepCompleted = (stepStatus) => {
      if (!order.value) return false
      
      const currentIndex = orderSteps.findIndex(step => step.status === order.value.status)
      const stepIndex = orderSteps.findIndex(step => step.status === stepStatus)
      
      return stepIndex < currentIndex
    }
    
    const getStatusIcon = (status) => {
      const icons = {
        pending: 'fas fa-clock',
        confirmed: 'fas fa-check',
        preparing: 'fas fa-utensils',
        ready: 'fas fa-bell',
        completed: 'fas fa-star'
      }
      return icons[status] || 'fas fa-question'
    }
    
    const getStatusText = (status) => {
      const texts = {
        pending: 'Pendiente',
        confirmed: 'Confirmado',
        preparing: 'Preparando',
        ready: 'Listo',
        completed: 'Completado'
      }
      return texts[status] || 'Desconocido'
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const loadOrder = () => {
      const orderId = parseInt(route.params.id)
      const foundOrder = cartStore.userOrders.find(o => o.id === orderId)
      order.value = foundOrder || null
    }
    
    const cancelOrder = () => {
      Swal.fire({
        title: '¿Cancelar pedido?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, mantener',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if (result.isConfirmed) {
          // Aquí iría la lógica para cancelar el pedido
          Swal.fire({
            title: 'Pedido cancelado',
            text: 'Tu pedido ha sido cancelado exitosamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        }
      })
    }
    
    const simulateStatusUpdate = () => {
      if (!order.value) return
      
      const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'completed']
      const currentIndex = statusFlow.indexOf(order.value.status)
      
      if (currentIndex < statusFlow.length - 1) {
        const nextStatus = statusFlow[currentIndex + 1]
        cartStore.updateOrderStatus(order.value.id, nextStatus)
        order.value.status = nextStatus
      }
    }
    
    onMounted(() => {
      loadOrder()
    })
    
    return {
      order,
      orderSteps,
      progressWidth,
      isStepActive,
      isStepCompleted,
      getStatusIcon,
      getStatusText,
      formatDate,
      cancelOrder,
      simulateStatusUpdate
    }
  }
}
</script>

<style scoped>
.order-status-page {
  padding: 2rem 0;
  min-height: calc(100vh - 140px);
}

.order-not-found {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.order-not-found i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.order-not-found h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* Header del pedido */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.order-info h1 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.order-date {
  color: #666;
  font-size: 1.1rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.1rem;
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
}

.status-confirmed {
  background: rgba(23, 162, 184, 0.2);
  color: #0c5460;
}

.status-preparing {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
}

.status-ready {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
}

.status-completed {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
}

/* Progreso del pedido */
.order-progress {
  margin-bottom: 3rem;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}

.progress-container {
  position: relative;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  max-width: 150px;
}

.step-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  background: #e9ecef;
  color: #6c757d;
  transition: var(--transition);
}

.progress-step.completed .step-icon,
.progress-step.active .step-icon {
  background: var(--primary-color);
  color: white;
}

.step-info h4 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: var(--primary-color);
}

.step-info p {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.progress-line {
  position: absolute;
  top: 30px;
  left: 0;
  height: 4px;
  background: var(--primary-color);
  transition: width 0.5s ease;
  z-index: 1;
}

.progress-line::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: #e9ecef;
  z-index: -1;
  width: 100vw;
}

/* Contenido del pedido */
.order-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.section-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-card h3 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Items del pedido */
.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.item-details {
  flex: 1;
}

.item-details h4 {
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.item-details p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-price-qty {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.quantity {
  color: #666;
}

.price {
  color: var(--secondary-color);
  font-weight: 500;
}

.item-total {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--secondary-color);
}

.order-total {
  border-top: 2px solid #e9ecef;
  padding-top: 1rem;
  margin-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

/* Información de entrega */
.delivery-info {
  text-align: center;
}

.estimated-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.time-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.time-label {
  color: #666;
  font-size: 0.9rem;
}

.delivery-note {
  color: #666;
  font-style: italic;
}

/* Información del cliente */
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: var(--primary-color);
}

/* Acciones */
.order-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-danger {
  border-color: var(--danger);
  color: var(--danger);
}

.btn-danger:hover {
  background-color: var(--danger);
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .progress-steps {
    flex-direction: column;
    gap: 2rem;
  }
  
  .progress-line {
    display: none;
  }
  
  .order-content {
    grid-template-columns: 1fr;
  }
  
  .order-item {
    flex-direction: column;
    text-align: center;
  }
  
  .item-price-qty {
    justify-content: center;
  }
}
</style>

