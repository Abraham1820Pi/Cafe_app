import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false
  }),

  getters: {
    getUserInfo: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    async login(credentials) {
      try {
        // Simulación de API call
        const response = await this.mockApiCall('/api/login', credentials)
        
        if (response.success) {
          this.user = response.user
          this.token = response.token
          this.isAuthenticated = true
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          
          Swal.fire({
            title: '¡Bienvenido!',
            text: `Hola ${response.user.name}, has iniciado sesión correctamente`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          
          return { success: true }
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Credenciales incorrectas',
          icon: 'error'
        })
        return { success: false, error: error.message }
      }
    },

    async register(userData) {
      try {
        // Simulación de API call
        const response = await this.mockApiCall('/api/register', userData)
        
        if (response.success) {
          Swal.fire({
            title: '¡Registro exitoso!',
            text: 'Tu cuenta ha sido creada correctamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          
          return { success: true }
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Error al crear la cuenta',
          icon: 'error'
        })
        return { success: false, error: error.message }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      Swal.fire({
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false
      })
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    },

    // Simulación de llamadas a API
    async mockApiCall(endpoint, data) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (endpoint === '/api/login') {
            if (data.email === 'admin@cafe.com' && data.password === '123456') {
              resolve({
                success: true,
                user: {
                  id: 1,
                  name: 'Usuario Demo',
                  email: data.email,
                  loyaltyPoints: 150,
                  memberSince: '2024-01-01'
                },
                token: 'mock-jwt-token-' + Date.now()
              })
            } else {
              reject(new Error('Credenciales incorrectas'))
            }
          } else if (endpoint === '/api/register') {
            resolve({
              success: true,
              message: 'Usuario registrado correctamente'
            })
          }
        }, 1000)
      })
    }
  }
})

