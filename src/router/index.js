import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Products from '@/views/Products.vue'
import Cart from '@/views/Cart.vue'
import Profile from '@/views/Profile.vue'
import Orders from '@/views/Orders.vue'
import OrderStatus from '@/views/OrderStatus.vue'
import Reviews from '@/views/Reviews.vue'
import Loyalty from '@/views/Loyalty.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-status/:id',
    name: 'OrderStatus',
    component: OrderStatus,
    meta: { requiresAuth: true }
  },
  {
    path: '/reviews',
    name: 'Reviews',
    component: Reviews,
    meta: { requiresAuth: true }
  },
  {
    path: '/loyalty',
    name: 'Loyalty',
    component: Loyalty,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardias de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

