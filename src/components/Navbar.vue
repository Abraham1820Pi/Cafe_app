<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-content">
        <router-link to="/" class="logo">
          <i class="fas fa-coffee"></i>
          CaféApp
        </router-link>

        <ul class="nav-links">
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/products">Productos</router-link></li>

          <template v-if="isAuthenticated">
            <li>
              <router-link to="/cart" class="cart-link">
                <i class="fas fa-shopping-cart"></i>
                Carrito
                <span v-if="cartItemCount > 0" class="cart-badge">{{
                  cartItemCount
                }}</span>
              </router-link>
            </li>
            <li><router-link to="/orders">Mis Pedidos</router-link></li>
            <li><router-link to="/loyalty">Fidelización</router-link></li>
            <li><router-link to="/profile">Perfil</router-link></li>
            <li>
              <button @click="logout" class="btn btn-outline">
                <i class="fas fa-sign-out-alt"></i>
                Salir
              </button>
            </li>
          </template>

          <template v-else>
            <li><router-link to="/login">Iniciar Sesión</router-link></li>
            <li><router-link to="/register">Registrarse</router-link></li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { computed } from "vue";

export default {
  name: "Navbar",
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const cartItemCount = computed(() => cartStore.cartItemCount);

    const logout = () => {
      authStore.logout();
    };

    return {
      isAuthenticated,
      cartItemCount,
      logout,
    };
  },
};
</script>

<style scoped>
.cart-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--danger);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.nav-links li {
  display: flex;
  align-items: center;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-outline:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }

  .nav-links {
    flex-direction: row;
    gap: 0.5rem;
    width: auto;
    text-align: center;
  }

  .nav-links li {
    justify-content: center;
  }
}
</style>
