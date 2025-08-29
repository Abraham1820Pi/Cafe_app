<template>
  <div class="products-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1><i class="fas fa-coffee"></i> Nuestros Productos</h1>
        <p>Descubre nuestra selección de cafés artesanales y deliciosos acompañamientos</p>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filters-container">
          <div class="category-filters">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="['filter-btn', { active: selectedCategory === category }]"
            >
              {{ category }}
            </button>
          </div>
          
          <div class="search-filter">
            <div class="search-input">
              <i class="fas fa-search"></i>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Buscar productos..."
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Productos -->
      <div class="products-section">
        <div v-if="filteredProducts.length === 0" class="no-products">
          <i class="fas fa-search"></i>
          <h3>No se encontraron productos</h3>
          <p>Intenta con otros términos de búsqueda o categoría</p>
        </div>
        
        <div v-else class="product-grid">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >
            <div class="product-image-container">
              <img :src="product.image" :alt="product.name" class="product-image" />
              <div class="product-overlay">
                <button
                  @click="addToCart(product)"
                  class="btn btn-primary add-to-cart-btn"
                  :disabled="!isAuthenticated"
                >
                  <i class="fas fa-cart-plus"></i>
                  Agregar
                </button>
              </div>
            </div>
            
            <div class="product-info">
              <div class="product-category">{{ product.category }}</div>
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              
              <div class="product-rating">
                <div class="stars">
                  <i v-for="n in 5" :key="n" 
                     :class="n <= product.rating ? 'fas fa-star' : 'far fa-star'"></i>
                </div>
                <span class="rating-value">({{ product.rating }})</span>
              </div>
              
              <div class="product-footer">
                <div class="product-price">${{ (product.price / 100).toFixed(2) }}</div>
                <button
                  @click="addToCart(product)"
                  class="btn btn-primary btn-sm"
                  :disabled="!isAuthenticated"
                >
                  <i class="fas fa-cart-plus"></i>
                  {{ isAuthenticated ? 'Agregar' : 'Inicia sesión' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carrito flotante -->
      <div v-if="isAuthenticated && cartItemCount > 0" class="floating-cart">
        <router-link to="/cart" class="floating-cart-btn">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-count">{{ cartItemCount }}</span>
          <span class="cart-total">${{ (cartTotal / 100).toFixed(2) }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Products',
  setup() {
    const productsStore = useProductsStore()
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    
    const selectedCategory = ref('Todos')
    const searchQuery = ref('')
    
    const categories = computed(() => productsStore.allCategories)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const cartItemCount = computed(() => cartStore.cartItemCount)
    const cartTotal = computed(() => cartStore.cartTotal)
    
    const filteredProducts = computed(() => {
      let products = productsStore.productsByCategory(selectedCategory.value)
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        products = products.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        )
      }
      
      return products
    })
    
    const addToCart = (product) => {
      if (!isAuthenticated.value) {
        return
      }
      cartStore.addToCart(product)
    }
    
    return {
      categories,
      selectedCategory,
      searchQuery,
      filteredProducts,
      isAuthenticated,
      cartItemCount,
      cartTotal,
      addToCart
    }
  }
}
</script>

<style scoped>
.products-page {
  padding: 2rem 0;
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
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

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

.category-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--primary-color);
  background: transparent;
  color: var(--primary-color);
  border-radius: 25px;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--primary-color);
  color: white;
}

.search-filter {
  flex: 1;
  max-width: 300px;
}

.search-input {
  position: relative;
}

.search-input i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input .form-control {
  padding-left: 2.5rem;
}

.products-section {
  margin-bottom: 4rem;
}

.no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-products i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.no-products h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: var(--transition);
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.add-to-cart-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-info {
  padding: 1.5rem;
}

.product-category {
  font-size: 0.8rem;
  color: var(--secondary-color);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.product-description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  color: #ffc107;
}

.rating-value {
  color: #666;
  font-size: 0.9rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--secondary-color);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.floating-cart {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.floating-cart-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(139, 69, 19, 0.3);
  transition: var(--transition);
  font-weight: 600;
}

.floating-cart-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(139, 69, 19, 0.4);
  color: white;
}

.cart-count {
  background: white;
  color: var(--primary-color);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.cart-total {
  font-size: 1.1rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    max-width: none;
  }
  
  .category-filters {
    justify-content: center;
  }
  
  .product-grid {
    grid-template-columns: 1fr;
  }
  
  .floating-cart {
    bottom: 1rem;
    right: 1rem;
  }
  
  .floating-cart-btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
}
</style>

