<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3><i class="fas fa-coffee"></i> CaféApp</h3>
          <p>Tu café favorito, ahora más cerca que nunca.</p>
        </div>
        
        <div class="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/products">Productos</router-link></li>
            <li><router-link to="/reviews">Reseñas</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Contacto</h4>
          <p><i class="fas fa-phone"></i> +1 234 567 8900</p>
          <p><i class="fas fa-envelope"></i> info@cafeapp.com</p>
          <p><i class="fas fa-map-marker-alt"></i> Calle Principal 123</p>
        </div>
        
        <div class="footer-section">
          <h4>Síguenos</h4>
          <div class="social-links">
            <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 CaféApp. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: var(--white);
  padding: 2rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: var(--white);
}

.footer-section h3 {
  font-size: 1.5rem;
}

.footer-section h4 {
  font-size: 1.2rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: var(--transition);
}

.footer-section a:hover {
  color: var(--white);
}

.footer-section p {
  margin-bottom: 0.5rem;
  color: rgba(255,255,255,0.8);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 50%;
  color: var(--white);
  text-decoration: none;
  transition: var(--transition);
}

.social-link:hover {
  background-color: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 1rem;
  text-align: center;
  color: rgba(255,255,255,0.8);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>

