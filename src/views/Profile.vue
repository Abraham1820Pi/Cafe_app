<template>
  <div class="profile-page">
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-user"></i> Mi Perfil</h1>
        <p>Gestiona tu información personal y preferencias</p>
      </div>

      <div class="profile-content">
        <!-- Información del usuario -->
        <div class="profile-section">
          <div class="section-card">
            <div class="card-header">
              <h3><i class="fas fa-user-edit"></i> Información Personal</h3>
              <button @click="toggleEditMode" class="btn btn-outline">
                <i :class="editMode ? 'fas fa-times' : 'fas fa-edit'"></i>
                {{ editMode ? 'Cancelar' : 'Editar' }}
              </button>
            </div>
            
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-user"></i>
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    v-model="profileForm.name"
                    class="form-control"
                    :readonly="!editMode"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-envelope"></i>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    v-model="profileForm.email"
                    class="form-control"
                    :readonly="!editMode"
                    required
                  />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-phone"></i>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    v-model="profileForm.phone"
                    class="form-control"
                    :readonly="!editMode"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-calendar"></i>
                    Miembro desde
                  </label>
                  <input
                    type="text"
                    :value="formatDate(user.memberSince)"
                    class="form-control"
                    readonly
                  />
                </div>
              </div>
              
              <div v-if="editMode" class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="updating">
                  <i v-if="updating" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-save"></i>
                  {{ updating ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Estadísticas del usuario -->
        <div class="stats-section">
          <div class="section-card">
            <h3><i class="fas fa-chart-bar"></i> Mis Estadísticas</h3>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ totalOrders }}</div>
                  <div class="stat-label">Pedidos Realizados</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-star"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ user.loyaltyPoints }}</div>
                  <div class="stat-label">Puntos de Fidelidad</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">${{ (totalSpent / 100).toFixed(0) }}</div>
                  <div class="stat-label">Total Gastado</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="fas fa-coffee"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ favoriteProduct }}</div>
                  <div class="stat-label">Producto Favorito</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferencias -->
        <div class="preferences-section">
          <div class="section-card">
            <h3><i class="fas fa-cog"></i> Preferencias</h3>
            
            <div class="preferences-form">
              <div class="preference-item">
                <div class="preference-info">
                  <h4>Notificaciones por email</h4>
                  <p>Recibe ofertas especiales y novedades</p>
                </div>
                <div class="preference-control">
                  <label class="switch">
                    <input type="checkbox" v-model="preferences.emailNotifications" @change="updatePreferences">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="preference-item">
                <div class="preference-info">
                  <h4>Notificaciones push</h4>
                  <p>Recibe actualizaciones sobre tus pedidos</p>
                </div>
                <div class="preference-control">
                  <label class="switch">
                    <input type="checkbox" v-model="preferences.pushNotifications" @change="updatePreferences">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="preference-item">
                <div class="preference-info">
                  <h4>Recordar preferencias de pedido</h4>
                  <p>Guarda tus productos favoritos para pedidos rápidos</p>
                </div>
                <div class="preference-control">
                  <label class="switch">
                    <input type="checkbox" v-model="preferences.rememberOrders" @change="updatePreferences">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cambio de contraseña -->
        <div class="password-section">
          <div class="section-card">
            <h3><i class="fas fa-key"></i> Cambiar Contraseña</h3>
            
            <form @submit.prevent="changePassword" class="password-form">
              <div class="form-group">
                <label class="form-label">Contraseña actual</label>
                <input
                  type="password"
                  v-model="passwordForm.currentPassword"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nueva contraseña</label>
                  <input
                    type="password"
                    v-model="passwordForm.newPassword"
                    class="form-control"
                    minlength="6"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    v-model="passwordForm.confirmPassword"
                    class="form-control"
                    required
                  />
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary" :disabled="changingPassword || !passwordsMatch">
                <i v-if="changingPassword" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-key"></i>
                {{ changingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
              </button>
              
              <div v-if="passwordForm.newPassword && passwordForm.confirmPassword && !passwordsMatch" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                Las contraseñas no coinciden
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import Swal from 'sweetalert2'

export default {
  name: 'Profile',
  setup() {
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    
    const editMode = ref(false)
    const updating = ref(false)
    const changingPassword = ref(false)
    
    const profileForm = ref({
      name: '',
      email: '',
      phone: ''
    })
    
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const preferences = ref({
      emailNotifications: true,
      pushNotifications: true,
      rememberOrders: true
    })
    
    const user = computed(() => authStore.user)
    const orders = computed(() => cartStore.userOrders)
    
    const totalOrders = computed(() => orders.value.length)
    const totalSpent = computed(() => {
      return orders.value.reduce((total, order) => total + order.total, 0)
    })
    
    const favoriteProduct = computed(() => {
      const productCounts = {}
      orders.value.forEach(order => {
        order.items.forEach(item => {
          productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity
        })
      })
      
      const mostOrdered = Object.entries(productCounts)
        .sort(([,a], [,b]) => b - a)[0]
      
      return mostOrdered ? mostOrdered[0] : 'Ninguno'
    })
    
    const passwordsMatch = computed(() => {
      return passwordForm.value.newPassword === passwordForm.value.confirmPassword
    })
    
    const initializeForm = () => {
      if (user.value) {
        profileForm.value = {
          name: user.value.name,
          email: user.value.email,
          phone: user.value.phone || ''
        }
      }
    }
    
    const toggleEditMode = () => {
      editMode.value = !editMode.value
      if (!editMode.value) {
        initializeForm() // Resetear cambios si se cancela
      }
    }
    
    const updateProfile = async () => {
      updating.value = true
      
      try {
        // Simulación de actualización
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Actualizar datos del usuario en el store
        authStore.user.name = profileForm.value.name
        authStore.user.email = profileForm.value.email
        authStore.user.phone = profileForm.value.phone
        
        // Actualizar en localStorage
        localStorage.setItem('user', JSON.stringify(authStore.user))
        
        editMode.value = false
        
        Swal.fire({
          title: '¡Perfil actualizado!',
          text: 'Tus datos han sido actualizados correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el perfil',
          icon: 'error'
        })
      } finally {
        updating.value = false
      }
    }
    
    const updatePreferences = () => {
      // Guardar preferencias en localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences.value))
      
      Swal.fire({
        title: 'Preferencias guardadas',
        text: 'Tus preferencias han sido actualizadas',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
      })
    }
    
    const changePassword = async () => {
      if (!passwordsMatch.value) return
      
      changingPassword.value = true
      
      try {
        // Simulación de cambio de contraseña
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        
        Swal.fire({
          title: '¡Contraseña cambiada!',
          text: 'Tu contraseña ha sido actualizada correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cambiar la contraseña',
          icon: 'error'
        })
      } finally {
        changingPassword.value = false
      }
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    const loadPreferences = () => {
      const savedPreferences = localStorage.getItem('userPreferences')
      if (savedPreferences) {
        preferences.value = JSON.parse(savedPreferences)
      }
    }
    
    onMounted(() => {
      initializeForm()
      loadPreferences()
    })
    
    return {
      user,
      editMode,
      updating,
      changingPassword,
      profileForm,
      passwordForm,
      preferences,
      totalOrders,
      totalSpent,
      favoriteProduct,
      passwordsMatch,
      toggleEditMode,
      updateProfile,
      updatePreferences,
      changePassword,
      formatDate
    }
  }
}
</script>

<style scoped>
.profile-page {
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

.profile-content {
  display: grid;
  gap: 2rem;
}

.section-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.card-header h3 {
  color: var(--primary-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-card h3 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Formularios */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-control[readonly] {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(210, 105, 30, 0.1));
  border-radius: var(--border-radius);
  border: 1px solid rgba(139, 69, 19, 0.2);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
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

/* Preferencias */
.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.preference-item:last-child {
  border-bottom: none;
}

.preference-info h4 {
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.preference-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

/* Switch toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: var(--transition);
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: var(--transition);
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Formulario de contraseña */
.password-form {
  max-width: 500px;
}

.error-message {
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    justify-content: center;
    text-align: center;
  }
  
  .preference-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .preference-control {
    align-self: flex-end;
  }
}
</style>

