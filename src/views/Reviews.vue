<template>
  <div class="reviews-page">
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-star"></i> Reseñas y Calificaciones</h1>
        <p>Comparte tu experiencia y lee las opiniones de otros clientes</p>
      </div>

      <!-- Filtros y acciones -->
      <div class="actions-section">
        <div class="filters-container">
          <div class="product-filter">
            <select v-model="selectedProduct" class="form-control">
              <option value="">Todos los productos</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>
          
          <div class="rating-filter">
            <select v-model="selectedRating" class="form-control">
              <option value="">Todas las calificaciones</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
          </div>
        </div>
        
        <button v-if="isAuthenticated" @click="showAddReviewModal = true" class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Escribir Reseña
        </button>
      </div>

      <!-- Lista de reseñas -->
      <div class="reviews-section">
        <div v-if="filteredReviews.length === 0" class="no-reviews">
          <i class="fas fa-comments"></i>
          <h3>No hay reseñas disponibles</h3>
          <p v-if="!isAuthenticated">Inicia sesión para escribir la primera reseña</p>
          <p v-else>Sé el primero en escribir una reseña</p>
        </div>

        <div v-else class="reviews-list">
          <div
            v-for="review in filteredReviews"
            :key="review.id"
            class="review-card"
          >
            <div class="review-header">
              <div class="reviewer-info">
                <div class="reviewer-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div class="reviewer-details">
                  <h4>{{ review.userName }}</h4>
                  <p class="review-date">{{ formatDate(review.date) }}</p>
                </div>
              </div>
              
              <div class="review-rating">
                <div class="stars">
                  <i v-for="n in 5" :key="n" 
                     :class="n <= review.rating ? 'fas fa-star' : 'far fa-star'"></i>
                </div>
                <span class="rating-value">{{ review.rating }}/5</span>
              </div>
            </div>

            <div class="review-content">
              <div class="product-info">
                <img :src="getProductImage(review.productId)" :alt="getProductName(review.productId)" class="product-image" />
                <span class="product-name">{{ getProductName(review.productId) }}</span>
              </div>
              
              <div class="review-text">
                <p>{{ review.comment }}</p>
              </div>
              
              <div class="review-actions">
                <button class="action-btn" @click="likeReview(review.id)">
                  <i class="fas fa-thumbs-up"></i>
                  Útil ({{ review.likes || 0 }})
                </button>
                
                <button v-if="review.userId === user?.id" @click="editReview(review)" class="action-btn">
                  <i class="fas fa-edit"></i>
                  Editar
                </button>
                
                <button v-if="review.userId === user?.id" @click="deleteReview(review.id)" class="action-btn delete-btn">
                  <i class="fas fa-trash"></i>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas de reseñas -->
      <div class="stats-section">
        <div class="stats-card">
          <h3><i class="fas fa-chart-bar"></i> Estadísticas de Reseñas</h3>
          
          <div class="rating-breakdown">
            <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="rating-row">
              <span class="rating-label">{{ rating }} estrellas</span>
              <div class="rating-bar">
                <div class="rating-fill" :style="{ width: getRatingPercentage(rating) + '%' }"></div>
              </div>
              <span class="rating-count">{{ getRatingCount(rating) }}</span>
            </div>
          </div>
          
          <div class="overall-rating">
            <div class="rating-value">{{ averageRating }}</div>
            <div class="rating-stars">
              <i v-for="n in 5" :key="n" 
                 :class="n <= Math.round(averageRating) ? 'fas fa-star' : 'far fa-star'"></i>
            </div>
            <div class="rating-text">{{ totalReviews }} reseñas</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar reseña -->
    <div v-if="showAddReviewModal" class="modal-overlay" @click="closeReviewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-star"></i>
            {{ editingReview ? 'Editar Reseña' : 'Escribir Reseña' }}
          </h3>
          <button @click="closeReviewModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="submitReview" class="review-form">
          <div class="form-group">
            <label class="form-label">Producto</label>
            <select v-model="reviewForm.productId" class="form-control" required>
              <option value="">Selecciona un producto</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Calificación</label>
            <div class="rating-input">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                @click="reviewForm.rating = n"
                :class="['star-btn', { active: n <= reviewForm.rating }]"
              >
                <i :class="n <= reviewForm.rating ? 'fas fa-star' : 'far fa-star'"></i>
              </button>
              <span class="rating-text">{{ reviewForm.rating }}/5</span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Comentario</label>
            <textarea
              v-model="reviewForm.comment"
              class="form-control"
              rows="4"
              placeholder="Comparte tu experiencia con este producto..."
              required
            ></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeReviewModal" class="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="submittingReview">
              <i v-if="submittingReview" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ submittingReview ? 'Guardando...' : (editingReview ? 'Actualizar' : 'Publicar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

export default {
  name: 'Reviews',
  setup() {
    const productsStore = useProductsStore()
    const authStore = useAuthStore()
    
    const selectedProduct = ref('')
    const selectedRating = ref('')
    const showAddReviewModal = ref(false)
    const submittingReview = ref(false)
    const editingReview = ref(null)
    
    const reviewForm = ref({
      productId: '',
      rating: 0,
      comment: ''
    })
    
    // Mock reviews data
    const reviews = ref([
      {
        id: 1,
        productId: 1,
        userId: 1,
        userName: 'María García',
        rating: 5,
        comment: 'Excelente espresso, muy bien preparado. El sabor es intenso y aromático, justo como me gusta.',
        date: '2024-01-15T10:30:00Z',
        likes: 3
      },
      {
        id: 2,
        productId: 2,
        userId: 2,
        userName: 'Carlos López',
        rating: 4,
        comment: 'Muy buen cappuccino, la espuma está perfecta. Solo le faltó un poco más de temperatura.',
        date: '2024-01-14T15:45:00Z',
        likes: 1
      },
      {
        id: 3,
        productId: 1,
        userId: 3,
        userName: 'Ana Martínez',
        rating: 5,
        comment: 'Mi café favorito! Siempre consistente en calidad y sabor. Altamente recomendado.',
        date: '2024-01-13T09:20:00Z',
        likes: 5
      }
    ])
    
    const products = computed(() => productsStore.allProducts)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const user = computed(() => authStore.user)
    
    const filteredReviews = computed(() => {
      let filtered = reviews.value
      
      if (selectedProduct.value) {
        filtered = filtered.filter(review => review.productId === parseInt(selectedProduct.value))
      }
      
      if (selectedRating.value) {
        filtered = filtered.filter(review => review.rating === parseInt(selectedRating.value))
      }
      
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    })
    
    const totalReviews = computed(() => reviews.value.length)
    const averageRating = computed(() => {
      if (totalReviews.value === 0) return 0
      const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
      return (sum / totalReviews.value).toFixed(1)
    })
    
    const getProductName = (productId) => {
      const product = products.value.find(p => p.id === productId)
      return product ? product.name : 'Producto desconocido'
    }
    
    const getProductImage = (productId) => {
      const product = products.value.find(p => p.id === productId)
      return product ? product.image : ''
    }
    
    const getRatingCount = (rating) => {
      return reviews.value.filter(review => review.rating === rating).length
    }
    
    const getRatingPercentage = (rating) => {
      if (totalReviews.value === 0) return 0
      return (getRatingCount(rating) / totalReviews.value) * 100
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    const likeReview = (reviewId) => {
      const review = reviews.value.find(r => r.id === reviewId)
      if (review) {
        review.likes = (review.likes || 0) + 1
        
        Swal.fire({
          title: '¡Gracias!',
          text: 'Tu voto ha sido registrado',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        })
      }
    }
    
    const editReview = (review) => {
      editingReview.value = review
      reviewForm.value = {
        productId: review.productId,
        rating: review.rating,
        comment: review.comment
      }
      showAddReviewModal.value = true
    }
    
    const deleteReview = (reviewId) => {
      Swal.fire({
        title: '¿Eliminar reseña?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
      }).then((result) => {
        if (result.isConfirmed) {
          const index = reviews.value.findIndex(r => r.id === reviewId)
          if (index > -1) {
            reviews.value.splice(index, 1)
            
            Swal.fire({
              title: 'Reseña eliminada',
              text: 'Tu reseña ha sido eliminada exitosamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            })
          }
        }
      })
    }
    
    const closeReviewModal = () => {
      showAddReviewModal.value = false
      editingReview.value = null
      reviewForm.value = {
        productId: '',
        rating: 0,
        comment: ''
      }
    }
    
    const submitReview = async () => {
      submittingReview.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (editingReview.value) {
          // Editar reseña existente
          const index = reviews.value.findIndex(r => r.id === editingReview.value.id)
          if (index > -1) {
            reviews.value[index] = {
              ...reviews.value[index],
              productId: reviewForm.value.productId,
              rating: reviewForm.value.rating,
              comment: reviewForm.value.comment,
              date: new Date().toISOString()
            }
          }
        } else {
          // Crear nueva reseña
          const newReview = {
            id: Date.now(),
            productId: reviewForm.value.productId,
            userId: user.value.id,
            userName: user.value.name,
            rating: reviewForm.value.rating,
            comment: reviewForm.value.comment,
            date: new Date().toISOString(),
            likes: 0
          }
          
          reviews.value.unshift(newReview)
        }
        
        closeReviewModal()
        
        Swal.fire({
          title: editingReview.value ? '¡Reseña actualizada!' : '¡Reseña publicada!',
          text: 'Gracias por compartir tu experiencia',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar la reseña',
          icon: 'error'
        })
      } finally {
        submittingReview.value = false
      }
    }
    
    return {
      selectedProduct,
      selectedRating,
      showAddReviewModal,
      submittingReview,
      editingReview,
      reviewForm,
      products,
      isAuthenticated,
      user,
      filteredReviews,
      totalReviews,
      averageRating,
      getProductName,
      getProductImage,
      getRatingCount,
      getRatingPercentage,
      formatDate,
      likeReview,
      editReview,
      deleteReview,
      closeReviewModal,
      submitReview
    }
  }
}
</script>

<style scoped>
.reviews-page {
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

/* Acciones y filtros */
.actions-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  gap: 2rem;
}

.filters-container {
  display: flex;
  gap: 1rem;
}

.product-filter select,
.rating-filter select {
  min-width: 200px;
}

/* Lista de reseñas */
.no-reviews {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-reviews i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.no-reviews h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.review-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  transition: var(--transition);
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.reviewer-details h4 {
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.review-date {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.review-rating {
  text-align: right;
}

.stars {
  color: #ffc107;
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.rating-value {
  color: #666;
  font-size: 0.9rem;
}

.review-content {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.product-name {
  font-weight: 600;
  color: var(--primary-color);
}

.review-text {
  margin-bottom: 1.5rem;
}

.review-text p {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.review-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  background: none;
  border: 1px solid #ddd;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.action-btn:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.delete-btn:hover {
  background-color: var(--danger);
  border-color: var(--danger);
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
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-breakdown {
  margin-bottom: 2rem;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.rating-label {
  min-width: 80px;
  font-size: 0.9rem;
  color: #666;
}

.rating-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.rating-count {
  min-width: 30px;
  text-align: right;
  font-size: 0.9rem;
  color: #666;
}

.overall-rating {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(210, 105, 30, 0.1));
  border-radius: var(--border-radius);
}

.rating-value {
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-color);
  line-height: 1;
}

.rating-stars {
  color: #ffc107;
  font-size: 1.5rem;
  margin: 0.5rem 0;
}

.rating-text {
  color: #666;
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
  max-width: 600px;
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

.review-form {
  padding: 1.5rem;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ddd;
  cursor: pointer;
  transition: var(--transition);
}

.star-btn.active,
.star-btn:hover {
  color: #ffc107;
}

.rating-text {
  margin-left: 1rem;
  color: #666;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .actions-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-container {
    justify-content: center;
  }
  
  .review-header {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    text-align: center;
  }
  
  .product-info {
    justify-content: center;
  }
  
  .review-actions {
    justify-content: center;
  }
  
  .rating-row {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>

