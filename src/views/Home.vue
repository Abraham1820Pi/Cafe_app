<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Bienvenido a CaféApp</h1>
            <p class="hero-subtitle">
              Descubre los mejores cafés artesanales, preparados con amor y
              servidos con excelencia. Disfruta de una experiencia única en cada
              sorbo.
            </p>
            <div class="hero-buttons">
              <router-link to="/products" class="btn btn-primary">
                <i class="fas fa-coffee"></i>
                Ver Productos
              </router-link>
              <router-link
                v-if="!isAuthenticated"
                to="/register"
                class="btn btn-outline"
              >
                <i class="fas fa-user-plus"></i>
                Únete Ahora
              </router-link>
            </div>
          </div>
          <div class="hero-image">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500"
              alt="Café artesanal"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title text-center">¿Por qué elegir CaféApp?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-coffee"></i>
            </div>
            <h3>Café Premium</h3>
            <p>
              Granos seleccionados de las mejores fincas del mundo, tostados
              artesanalmente.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-clock"></i>
            </div>
            <h3>Entrega Rápida</h3>
            <p>
              Tu pedido estará listo en 15-20 minutos. Calidad y rapidez
              garantizada.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-star"></i>
            </div>
            <h3>Programa de Fidelidad</h3>
            <p>
              Gana puntos con cada compra y canjéalos por recompensas
              exclusivas.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <h3>Pedidos Online</h3>
            <p>
              Ordena desde cualquier lugar y recoge tu pedido cuando esté listo.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Products Section -->
    <section class="popular-products">
      <div class="container">
        <h2 class="section-title text-center">Productos Populares</h2>
        <div class="products-preview">
          <div
            v-for="product in popularProducts"
            :key="product.id"
            class="product-preview-card"
          >
            <img
              :src="product.image"
              :alt="product.name"
              class="product-preview-image"
            />
            <div class="product-preview-info">
              <h4>{{ product.name }}</h4>
              <p class="price">${{ (product.price / 1000).toFixed(3) }}</p>
              <div class="rating">
                <span class="stars">
                  <i
                    v-for="n in 5"
                    :key="n"
                    :class="n <= product.rating ? 'fas fa-star' : 'far fa-star'"
                  ></i>
                </span>
                <span class="rating-value">{{ product.rating }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <router-link to="/products" class="btn btn-secondary">
            Ver Todos los Productos
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta" v-if="!isAuthenticated">
      <div class="container">
        <div class="cta-content">
          <h2>¿Listo para comenzar?</h2>
          <p>
            Únete a nuestra comunidad de amantes del café y disfruta de
            beneficios exclusivos.
          </p>
          <router-link to="/register" class="btn btn-primary btn-large">
            <i class="fas fa-user-plus"></i>
            Crear Cuenta Gratis
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useProductsStore } from "@/stores/products";
import { computed } from "vue";

export default {
  name: "Home",
  setup() {
    const authStore = useAuthStore();
    const productsStore = useProductsStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const popularProducts = computed(() =>
      productsStore.allProducts.sort((a, b) => b.rating - a.rating).slice(0, 4)
    );

    return {
      isAuthenticated,
      popularProducts,
    };
  },
};
</script>

<style scoped>
/* Hero Section */
.hero {
  background: linear-gradient(
      135deg,
      rgba(139, 69, 19, 0.9),
      rgba(210, 105, 30, 0.9)
    ),
    url("https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200")
      center/cover;
  color: white;
  padding: 4rem 0;
  min-height: 500px;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

/* Features Section */
.features {
  padding: 4rem 0;
  background-color: linear-gradient(123deg, #f8f9fa, 70%, #cd853f 100%);
}

.section-title {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 3rem;
  font-weight: bold;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  text-align: center;
  transition: var(--transition);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Popular Products Section */
.popular-products {
  padding: 4rem 0;
}

.products-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.product-preview-card {
  background: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.product-preview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-preview-info {
  padding: 1.5rem;
}

.product-preview-info h4 {
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  color: #ffc107;
}

.rating-value {
  color: #666;
  font-size: 0.9rem;
}

/* CTA Section */
.cta {
  background: linear-gradient(135deg, #ffe1cc, 70% #cd853f 100%);
  color: var(--primary-color);
  padding: 4rem 0;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .features-grid,
  .products-preview {
    grid-template-columns: 1fr;
  }

  .hero-buttons {
    justify-content: center;
  }
}
</style>
