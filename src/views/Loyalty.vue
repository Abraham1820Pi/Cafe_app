<template>
  <div class="loyalty-page">
    <div class="container">
      <!-- Header con puntos del usuario -->
      <div class="loyalty-header">
        <div class="points-card">
          <div class="points-info">
            <div class="points-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="points-details">
              <h2>{{ user?.loyaltyPoints || 0 }}</h2>
              <p>Puntos disponibles</p>
            </div>
          </div>
          
          <div class="member-status">
            <div class="status-badge" :class="membershipLevel.class">
              <i :class="membershipLevel.icon"></i>
              {{ membershipLevel.name }}
            </div>
            <p class="next-level" v-if="membershipLevel.nextLevel">
              {{ pointsToNextLevel }} puntos para {{ membershipLevel.nextLevel }}
            </p>
          </div>
        </div>
      </div>

      <!-- Cómo ganar puntos -->
      <div class="earn-points-section">
        <div class="section-card">
          <h3><i class="fas fa-plus-circle"></i> Cómo Ganar Puntos</h3>
          
          <div class="earn-methods">
            <div class="earn-method">
              <div class="method-icon">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <div class="method-info">
                <h4>Compras</h4>
                <p>1 punto por cada $100 gastados</p>
              </div>
            </div>
            
            <div class="earn-method">
              <div class="method-icon">
                <i class="fas fa-star"></i>
              </div>
              <div class="method-info">
                <h4>Reseñas</h4>
                <p>10 puntos por cada reseña</p>
              </div>
            </div>
            
            <div class="earn-method">
              <div class="method-icon">
                <i class="fas fa-birthday-cake"></i>
              </div>
              <div class="method-info">
                <h4>Cumpleaños</h4>
                <p>50 puntos en tu día especial</p>
              </div>
            </div>
            
            <div class="earn-method">
              <div class="method-icon">
                <i class="fas fa-user-friends"></i>
              </div>
              <div class="method-info">
                <h4>Referidos</h4>
                <p>100 puntos por cada amigo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recompensas disponibles -->
      <div class="rewards-section">
        <div class="section-header">
          <h3><i class="fas fa-gift"></i> Recompensas Disponibles</h3>
          <p>Canjea tus puntos por increíbles recompensas</p>
        </div>
        
        <div class="rewards-grid">
          <div
            v-for="reward in availableRewards"
            :key="reward.id"
            class="reward-card"
          >
            <div class="reward-image">
              <img :src="reward.image" :alt="reward.name" />
              <div class="reward-overlay">
                <div class="points-cost">
                  <i class="fas fa-star"></i>
                  {{ reward.pointsCost }}
                </div>
              </div>
            </div>
            
            <div class="reward-info">
              <h4>{{ reward.name }}</h4>
              <p>{{ reward.description }}</p>
              
              <div class="reward-actions">
                <button
                  @click="redeemReward(reward.id)"
                  :disabled="!canRedeem(reward.pointsCost)"
                  :class="['btn', canRedeem(reward.pointsCost) ? 'btn-primary' : 'btn-disabled']"
                >
                  <i class="fas fa-gift"></i>
                  {{ canRedeem(reward.pointsCost) ? 'Canjear' : 'Puntos insuficientes' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recompensas canjeadas -->
      <div v-if="redeemedRewards.length > 0" class="redeemed-section">
        <div class="section-card">
          <h3><i class="fas fa-history"></i> Mis Recompensas</h3>
          
          <div class="redeemed-list">
            <div
              v-for="reward in redeemedRewards"
              :key="reward.id"
              class="redeemed-item"
            >
              <div class="redeemed-info">
                <h4>{{ reward.name }}</h4>
                <p>{{ reward.description }}</p>
                <span class="redeem-date">
                  Canjeado el {{ formatDate(reward.redeemedAt) }}
                </span>
              </div>
              
              <div class="redeemed-status">
                <span v-if="!reward.used" class="status-badge available">
                  <i class="fas fa-check-circle"></i>
                  Disponible
                </span>
                <span v-else class="status-badge used">
                  <i class="fas fa-times-circle"></i>
                  Utilizado
                </span>
                
                <button
                  v-if="!reward.used"
                  @click="useReward(reward.id)"
                  class="btn btn-sm btn-outline"
                >
                  <i class="fas fa-check"></i>
                  Marcar como usado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de puntos -->
      <div class="history-section">
        <div class="section-card">
          <h3><i class="fas fa-chart-line"></i> Historial de Puntos</h3>
          
          <div v-if="pointsHistory.length === 0" class="no-history">
            <i class="fas fa-history"></i>
            <p>No hay actividad de puntos aún</p>
          </div>
          
          <div v-else class="history-list">
            <div
              v-for="entry in pointsHistory"
              :key="entry.id"
              class="history-item"
            >
              <div class="history-icon" :class="entry.type">
                <i :class="entry.type === 'earned' ? 'fas fa-plus' : 'fas fa-minus'"></i>
              </div>
              
              <div class="history-info">
                <h4>{{ entry.description }}</h4>
                <span class="history-date">{{ formatDate(entry.date) }}</span>
              </div>
              
              <div class="history-points" :class="entry.type">
                {{ entry.type === 'earned' ? '+' : '' }}{{ entry.points }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Niveles de membresía -->
      <div class="membership-section">
        <div class="section-card">
          <h3><i class="fas fa-trophy"></i> Niveles de Membresía</h3>
          
          <div class="membership-levels">
            <div
              v-for="level in membershipLevels"
              :key="level.name"
              :class="['level-card', { active: level.name === membershipLevel.name }]"
            >
              <div class="level-icon">
                <i :class="level.icon"></i>
              </div>
              <div class="level-info">
                <h4>{{ level.name }}</h4>
                <p>{{ level.minPoints }}+ puntos</p>
                <ul class="level-benefits">
                  <li v-for="benefit in level.benefits" :key="benefit">{{ benefit }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLoyaltyStore } from '@/stores/loyalty'
import Swal from 'sweetalert2'

export default {
  name: 'Loyalty',
  setup() {
    const authStore = useAuthStore()
    const loyaltyStore = useLoyaltyStore()
    
    const user = computed(() => authStore.user)
    const availableRewards = computed(() => loyaltyStore.availableRewards)
    const redeemedRewards = computed(() => loyaltyStore.userRedeemedRewards)
    const pointsHistory = computed(() => loyaltyStore.userPointsHistory)
    
    const membershipLevels = [
      {
        name: 'Bronce',
        minPoints: 0,
        icon: 'fas fa-medal',
        class: 'bronze',
        benefits: ['1 punto por cada $100', 'Ofertas básicas']
      },
      {
        name: 'Plata',
        minPoints: 200,
        icon: 'fas fa-medal',
        class: 'silver',
        benefits: ['1.5 puntos por cada $100', '5% descuento', 'Ofertas exclusivas']
      },
      {
        name: 'Oro',
        minPoints: 500,
        icon: 'fas fa-crown',
        class: 'gold',
        benefits: ['2 puntos por cada $100', '10% descuento', 'Acceso prioritario']
      },
      {
        name: 'Platino',
        minPoints: 1000,
        icon: 'fas fa-gem',
        class: 'platinum',
        benefits: ['3 puntos por cada $100', '15% descuento', 'Eventos VIP']
      }
    ]
    
    const membershipLevel = computed(() => {
      const userPoints = user.value?.loyaltyPoints || 0
      let currentLevel = membershipLevels[0]
      
      for (let i = membershipLevels.length - 1; i >= 0; i--) {
        if (userPoints >= membershipLevels[i].minPoints) {
          currentLevel = membershipLevels[i]
          break
        }
      }
      
      // Encontrar el siguiente nivel
      const currentIndex = membershipLevels.findIndex(level => level.name === currentLevel.name)
      const nextLevel = currentIndex < membershipLevels.length - 1 ? membershipLevels[currentIndex + 1] : null
      
      return {
        ...currentLevel,
        nextLevel: nextLevel?.name
      }
    })
    
    const pointsToNextLevel = computed(() => {
      const userPoints = user.value?.loyaltyPoints || 0
      const currentIndex = membershipLevels.findIndex(level => level.name === membershipLevel.value.name)
      
      if (currentIndex < membershipLevels.length - 1) {
        return membershipLevels[currentIndex + 1].minPoints - userPoints
      }
      
      return 0
    })
    
    const canRedeem = (pointsCost) => {
      return user.value && user.value.loyaltyPoints >= pointsCost
    }
    
    const redeemReward = (rewardId) => {
      const result = loyaltyStore.redeemReward(rewardId)
      
      if (result.success) {
        // La notificación ya se muestra en el store
      }
    }
    
    const useReward = (rewardId) => {
      Swal.fire({
        title: '¿Marcar como utilizado?',
        text: 'Esta recompensa se marcará como utilizada',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, utilizar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          loyaltyStore.useReward(rewardId)
        }
      })
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    return {
      user,
      availableRewards,
      redeemedRewards,
      pointsHistory,
      membershipLevels,
      membershipLevel,
      pointsToNextLevel,
      canRedeem,
      redeemReward,
      useReward,
      formatDate
    }
  }
}
</script>

<style scoped>
.loyalty-page {
  padding: 2rem 0;
  min-height: calc(100vh - 140px);
}

/* Header de puntos */
.loyalty-header {
  margin-bottom: 3rem;
}

.points-card {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--box-shadow);
}

.points-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.points-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.points-details h2 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  line-height: 1;
}

.points-details p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.member-status {
  text-align: right;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255,255,255,0.2);
  border-radius: 25px;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.next-level {
  opacity: 0.8;
  font-size: 0.9rem;
  margin: 0;
}

/* Secciones */
.section-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-card h3,
.section-header h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-header h3 {
  justify-content: center;
  font-size: 2rem;
}

.section-header p {
  color: #666;
  font-size: 1.1rem;
}

/* Métodos para ganar puntos */
.earn-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.earn-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(210, 105, 30, 0.1));
  border-radius: var(--border-radius);
  border: 1px solid rgba(139, 69, 19, 0.2);
}

.method-icon {
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

.method-info h4 {
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.method-info p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

/* Recompensas */
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.reward-card {
  background: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.reward-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.reward-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.reward-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reward-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.points-cost {
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.reward-info {
  padding: 1.5rem;
}

.reward-info h4 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.reward-info p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.btn-disabled {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.btn-disabled:hover {
  background-color: #e9ecef;
  color: #6c757d;
}

/* Recompensas canjeadas */
.redeemed-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.redeemed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
}

.redeemed-info h4 {
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.redeemed-info p {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.redeem-date {
  color: #999;
  font-size: 0.8rem;
}

.redeemed-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.status-badge.available {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
}

.status-badge.used {
  background: rgba(108, 117, 125, 0.2);
  color: #495057;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
}

/* Historial */
.no-history {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.no-history i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.history-item:last-child {
  border-bottom: none;
}

.history-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.history-icon.earned {
  background: var(--success);
}

.history-icon.redeemed {
  background: var(--danger);
}

.history-info {
  flex: 1;
}

.history-info h4 {
  color: var(--primary-color);
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.history-date {
  color: #666;
  font-size: 0.8rem;
}

.history-points {
  font-size: 1.2rem;
  font-weight: bold;
}

.history-points.earned {
  color: var(--success);
}

.history-points.redeemed {
  color: var(--danger);
}

/* Niveles de membresía */
.membership-levels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.level-card {
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: var(--border-radius);
  text-align: center;
  transition: var(--transition);
}

.level-card.active {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(210, 105, 30, 0.1));
}

.level-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.level-card.bronze .level-icon {
  color: #cd7f32;
}

.level-card.silver .level-icon {
  color: #c0c0c0;
}

.level-card.gold .level-icon {
  color: #ffd700;
}

.level-card.platinum .level-icon {
  color: #e5e4e2;
}

.level-info h4 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.level-info p {
  color: #666;
  margin-bottom: 1rem;
}

.level-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
}

.level-benefits li {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  padding-left: 1rem;
  position: relative;
}

.level-benefits li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--success);
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .points-card {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  
  .member-status {
    text-align: center;
  }
  
  .earn-methods {
    grid-template-columns: 1fr;
  }
  
  .rewards-grid {
    grid-template-columns: 1fr;
  }
  
  .redeemed-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .redeemed-status {
    align-items: center;
  }
  
  .history-item {
    flex-direction: column;
    text-align: center;
  }
  
  .membership-levels {
    grid-template-columns: 1fr;
  }
}
</style>

