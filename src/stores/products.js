import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [
      {
        id: 1,
        name: 'Espresso',
        description: 'Café espresso tradicional italiano',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300',
        category: 'Café',
        rating: 4.8,
        reviews: []
      },
      {
        id: 2,
        name: 'Cappuccino',
        description: 'Espresso con leche vaporizada y espuma',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300',
        category: 'Café',
        rating: 4.9,
        reviews: []
      },
      {
        id: 3,
        name: 'Latte',
        description: 'Espresso con leche vaporizada y arte latte',
        price: 4000,
        image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=300',
        category: 'Café',
        rating: 4.7,
        reviews: []
      },
      {
        id: 4,
        name: 'Americano',
        description: 'Espresso diluido con agua caliente',
        price: 3000,
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300',
        category: 'Café',
        rating: 4.5,
        reviews: []
      },
      {
        id: 5,
        name: 'Frappé',
        description: 'Café frío con hielo y crema batida',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
        category: 'Bebidas Frías',
        rating: 4.6,
        reviews: []
      },
      {
        id: 6,
        name: 'Croissant',
        description: 'Croissant francés recién horneado',
        price: 2000,
        image: 'https://images.unsplash.com/photo-1555507036-ab794f4ade2a?w=300',
        category: 'Panadería',
        rating: 4.4,
        reviews: []
      },
      {
        id: 7,
        name: 'Muffin de Arándanos',
        description: 'Muffin casero con arándanos frescos',
        price: 2800,
        image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300',
        category: 'Panadería',
        rating: 4.3,
        reviews: []
      },
      {
        id: 8,
        name: 'Sandwich Club',
        description: 'Sandwich con pollo, tocino, lechuga y tomate',
        price: 5500,
        image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300',
        category: 'Comida',
        rating: 4.7,
        reviews: []
      }
    ],
    categories: ['Todos', 'Café', 'Bebidas Frías', 'Panadería', 'Comida'],
    reviews: []
  }),

  getters: {
    allProducts: (state) => state.products,
    productsByCategory: (state) => (category) => {
      if (category === 'Todos') return state.products
      return state.products.filter(product => product.category === category)
    },
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === id)
    },
    allCategories: (state) => state.categories,
    productReviews: (state) => (productId) => {
      return state.reviews.filter(review => review.productId === productId)
    }
  },

  actions: {
    addReview(review) {
      const newReview = {
        id: Date.now(),
        ...review,
        date: new Date().toISOString()
      }
      
      this.reviews.push(newReview)
      
      // Actualizar rating del producto
      const product = this.products.find(p => p.id === review.productId)
      if (product) {
        const productReviews = this.reviews.filter(r => r.productId === review.productId)
        const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
        product.rating = Math.round(averageRating * 10) / 10
      }
      
      return newReview
    },

    getReviewsByProduct(productId) {
      return this.reviews.filter(review => review.productId === productId)
    }
  }
})

