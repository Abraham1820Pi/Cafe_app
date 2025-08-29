<template>
  <div class="orders-page">
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-list"></i> Mis Pedidos</h1>
        <p>Historial completo de tus pedidos</p>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filters-container">
          <div class="status-filters">
            <button
              v-for="status in statusFilters"
              :key="status.value"
              @click="selectedStatus = status.value"
              :class="['filter-btn', { active: selectedStatus === status.value }]"
            >
              <i :class="status.icon"></i>
              {{ status.label }}
            </button>
          </div>
          
          <div class="date-filter">
            <select v-model="dateFilter" class="form-control">
              <option value="all">Todos los períodos</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="3months">Últimos 3 meses</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de pedidos -->
      <div class="orders-section">
        <div v-if="filteredOrders.length === 0" class="no-orders">
          <i class="fas fa-shopping-bag"></i>
          <h3>No se encontraron pedidos</h3>
          <p v-if="selectedStatus === 'all' && dateFilter === 'all'">
            Aún no has realizado ningún pedido
          </p>
          <p v-else>
            No hay pedidos que coincidan con los filtros seleccionados
          </p>
          <router-link to="/products" class="btn btn-primary">
            <i class="fas fa-coffee"></i>
            Explorar Productos
          </router-link>
        </div>

        <div v-else class="orders-list">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="order-card"
          >
            <div class="order-header">
              <div class="order-info">
                <h3>Pedido #{{ order.id }}</h3>
                <p class="order-date">{{ formatDate(order.date) }}</p>
              </div>
              
              <div class="order-status">
                <span :class="['status-badge', `status-${order.status}`]">
                  <i :class="getStatusIcon(order.status)"></i>
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>

            <div class="order-content">
              <div class="order-items">
                <div class="items-preview">
                  <div
                    v-for="(item, index) in order.items.slice(0, 3)"
                    :key="item.id"
                    class="item-preview"
                  >
                    <img :src="item.image" :alt="item.name" class="item-image" />
                    <div class="item-info">
                      <span class="item-name">{{ item.name }}</span>
                      <span class="item-quantity">x{{ item.quantity }}</span>
                    </div>
                  </div>
                  
                  <div v-if="order.items.length > 3" class="more-items">
                    +{{ order.items.length - 3 }} más
                  </div>
                </div>
              </div>

              <div class="order-summary">
                <div class="order-total">
                  <span class="total-label">Total:</span>
                  <span class="total-amount">${{ (order.total / 100).toFixed(2) }}</span>
                </div>
                
                <div class="order-actions">
                  <router-link
                    :to="`/order-status/${order.id}`"
                    class="btn btn-outline btn-sm"
                  >
                    <i class="fas fa-eye"></i>
                    Ver Detalles
                  </router-link>
                  
                  <button
                    v-if="order.status === 'completed'"
                    @click="reorderItems(order)"
                    class="btn btn-primary btn-sm"
                  >
                    <i class="fas fa-redo"></i>
                    Pedir de Nuevo
                  </button>
                  
                  <button
                    v-if="canCancelOrder(order)"
                    @click="cancelOrder(order.id)"
                    class="btn btn-outline btn-danger btn-sm"
                  >
                    <i class="fas fa-times"></i>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>

            <!-- Información adicional -->
            <div class="order-footer">
              <div class="order-details">
                <span v-if="order.estimatedTime" class="detail-item">
                  <i class="fas fa-clock"></i>
                  {{ order.estimatedTime }}
                </span>
                
                <span v-if="order.customerInfo?.paymentMethod" class="detail-item">
                  <i class="fas fa-credit-card"></i>
                  {{ getPaymentMethodText(order.customerInfo.paymentMethod) }}
                </span>
                
                <span v-if="order.customerInfo?.notes" class="detail-item">
                  <i class="fas fa-sticky-note"></i>
                  Con notas especiales
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen de estadísticas -->
      <div class="stats-section">
        <div class="stats-card">
          <h3><i class="fas fa-chart-bar"></i> Resumen de Pedidos</h3>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ totalOrders }}</div>
              <div class="stat-label">Total de Pedidos</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value">${{ (totalSpent / 100).toFixed(0) }}</div>
              <div class="stat-label">Total Gastado</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value">${{ averageOrderValue }}</div>
              <div class="stat-label">Promedio por Pedido</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value">{{ completedOrders }}</div>
              <div class="stat-label">Pedidos Completados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import Swal from 'sweetalert2'

export default {
  name: 'Orders',
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    
    const selectedStatus = ref('all')
    const dateFilter = ref('all')
    
    const statusFilters = [
      { value: 'all', label: 'Todos', icon: 'fas fa-list' },
      { value: 'pending', label: 'Pendientes', icon: 'fas fa-clock' },
      { value: 'confirmed', label: 'Confirmados', icon: 'fas fa-check' },
      { value: 'preparing', label: 'Preparando', icon: 'fas fa-utensils' },
      { value: 'ready', label: 'Listos', icon: 'fas fa-bell' },
      { value: 'completed', label: 'Completados', icon: 'fas fa-star' }
    ]
    
    const orders = computed(() => cartStore.userOrders)
    
    const filteredOrders = computed(() => {
      let filtered = orders.value
      
      // Filtrar por estado
      if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(order => order.status === selectedStatus.value)
      }
      
      // Filtrar por fecha
      if (dateFilter.value !== 'all') {
        const now = new Date()
        const filterDate = new Date()
        
        switch (dateFilter.value) {
          case 'week':
            filterDate.setDate(now.getDate() - 7)
            break
          case 'month':
            filterDate.setMonth(now.getMonth() - 1)
            break
          case '3months':
            filterDate.setMonth(now.getMonth() - 3)
            break
        }
        
        filtered = filtered.filter(order => new Date(order.date) >= filterDate)
      }
      
      // Ordenar por fecha (más reciente primero)
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    })
    
    const totalOrders = computed(() => orders.value.length)
    const totalSpent = computed(() => {
      return orders.value.reduce((total, order) => total + order.total, 0)
    })
    const averageOrderValue = computed(() => {
      if (totalOrders.value === 0) return '0'
      return ((totalSpent.value / totalOrders.value) / 100).toFixed(0)
    })
    const completedOrders = computed(() => {
      return orders.value.filter(order => order.status === 'completed').length
    })
    
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
    
    const getPaymentMethodText = (method) => {
      const methods = {
        cash: 'Efectivo',
        card: 'Tarjeta',
        transfer: 'Transferencia'
      }
      return methods[method] || method
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const canCancelOrder = (order) => {
      return order.status === 'pending' || order.status === 'confirmed'
    }
    
    const cancelOrder = (orderId) => {
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
    
    const reorderItems = (order) => {
      Swal.fire({
        title: '¿Agregar productos al carrito?',
        text: `Se agregarán ${order.items.length} productos de este pedido`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          order.items.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
              cartStore.addToCart(item)
            }
          })
          
          router.push('/cart')
        }
      })
    }
    
    return {
      selectedStatus,
      dateFilter,
      statusFilters,
      filteredOrders,
      totalOrders,
      totalSpent,
      averageOrderValue,
      completedOrders,
      getStatusIcon,
      getStatusText,
      getPaymentMethodText,
      formatDate,
      canCancelOrder,
      cancelOrder,
      reorderItems
    }
  }
}
</script>

<style scoped>
.orders-page {
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

/* Filtros */
.filters-section {
  margin-bottom: 3rem;
}

.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.status-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--primary-color);
  background: transparent;
  color: var(--primary-color);
  border-radius: 25px;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--primary-color);
  color: white;
}

.date-filter select {
  min-width: 200px;
}

/* Lista de pedidos */
.no-orders {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-orders i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.no-orders h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: var(--transition);
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.order-info h3 {
  color: var(--primary-color);
  margin-bottom: 0.25rem;
  font-size: 1.2rem;
}

.order-date {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
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

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  gap: 2rem;
}

.items-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.item-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--primary-color);
}

.item-quantity {
  font-size: 0.7rem;
  color: #666;
}

.more-items {
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
}

.order-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.order-total {
  text-align: right;
}

.total-label {
  color: #666;
  font-size: 0.9rem;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  display: block;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-danger {
  border-color: var(--danger);
  color: var(--danger);
}

.btn-danger:hover {
  background-color: var(--danger);
  color: white;
}

.order-footer {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.order-details {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.8rem;
}

.detail-item i {
  color: var(--primary-color);
}

/* Estadísticas */
.stats-section {
  margin-top: 3rem;
}

.stats-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}

.stats-card h3 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  line-height: 1;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .status-filters {
    justify-content: center;
  }
  
  .order-header {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    text-align: center;
  }
  
  .order-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .order-summary {
    align-items: center;
  }
  
  .order-actions {
    justify-content: center;
  }
  
  .order-details {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

