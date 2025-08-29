import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import Swal from 'sweetalert2'

export const useLoyaltyStore = defineStore('loyalty', {
  state: () => ({
    rewards: [
      {
        id: 1,
        name: 'Café Gratis',
        description: 'Un café espresso gratis',
        pointsCost: 100,
        image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=200'
      },
      {
        id: 2,
        name: '10% Descuento',
        description: '10% de descuento en tu próxima compra',
        pointsCost: 150,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200'
      },
      {
        id: 3,
        name: 'Combo Desayuno',
        description: 'Café + croissant gratis',
        pointsCost: 200,
        image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=200'
      },
      {
        id: 4,
        name: '20% Descuento',
        description: '20% de descuento en tu próxima compra',
        pointsCost: 300,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200'
      }
    ],
    userRewards: [],
    pointsHistory: []
  }),

  getters: {
    availableRewards: (state) => state.rewards,
    userRedeemedRewards: (state) => state.userRewards,
    userPointsHistory: (state) => state.pointsHistory,
    canRedeemReward: (state) => (rewardId) => {
      const authStore = useAuthStore()
      const reward = state.rewards.find(r => r.id === rewardId)
      return authStore.user && authStore.user.loyaltyPoints >= reward.pointsCost
    }
  },

  actions: {
    addPoints(points, description) {
      const authStore = useAuthStore()
      if (authStore.user) {
        authStore.user.loyaltyPoints += points
        
        this.pointsHistory.push({
          id: Date.now(),
          points: points,
          description: description,
          date: new Date().toISOString(),
          type: 'earned'
        })
        
        // Actualizar en localStorage
        localStorage.setItem('user', JSON.stringify(authStore.user))
        
        Swal.fire({
          title: '¡Puntos ganados!',
          text: `Has ganado ${points} puntos por ${description}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        })
      }
    },

    redeemReward(rewardId) {
      const authStore = useAuthStore()
      const reward = this.rewards.find(r => r.id === rewardId)
      
      if (!reward) return { success: false, error: 'Recompensa no encontrada' }
      
      if (!authStore.user || authStore.user.loyaltyPoints < reward.pointsCost) {
        Swal.fire({
          title: 'Puntos insuficientes',
          text: `Necesitas ${reward.pointsCost} puntos para canjear esta recompensa`,
          icon: 'warning'
        })
        return { success: false, error: 'Puntos insuficientes' }
      }
      
      // Descontar puntos
      authStore.user.loyaltyPoints -= reward.pointsCost
      
      // Agregar recompensa canjeada
      this.userRewards.push({
        id: Date.now(),
        rewardId: reward.id,
        name: reward.name,
        description: reward.description,
        redeemedAt: new Date().toISOString(),
        used: false
      })
      
      // Agregar al historial
      this.pointsHistory.push({
        id: Date.now(),
        points: -reward.pointsCost,
        description: `Canje: ${reward.name}`,
        date: new Date().toISOString(),
        type: 'redeemed'
      })
      
      // Actualizar en localStorage
      localStorage.setItem('user', JSON.stringify(authStore.user))
      
      Swal.fire({
        title: '¡Recompensa canjeada!',
        text: `Has canjeado ${reward.name} por ${reward.pointsCost} puntos`,
        icon: 'success'
      })
      
      return { success: true }
    },

    useReward(userRewardId) {
      const userReward = this.userRewards.find(r => r.id === userRewardId)
      if (userReward && !userReward.used) {
        userReward.used = true
        userReward.usedAt = new Date().toISOString()
        
        Swal.fire({
          title: 'Recompensa utilizada',
          text: `Has utilizado: ${userReward.name}`,
          icon: 'info',
          timer: 2000,
          showConfirmButton: false
        })
        
        return { success: true }
      }
      return { success: false }
    },

    // Calcular puntos basados en el total de la compra
    calculatePointsFromPurchase(total) {
      // 1 punto por cada $100 gastados
      return Math.floor(total / 100)
    }
  }
})

