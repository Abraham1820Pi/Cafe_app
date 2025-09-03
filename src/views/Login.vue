<template>
  <div class="login-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h2><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</h2>
            <p>Ingresa a tu cuenta para continuar</p>
          </div>

          <form @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label for="email" class="form-label">
                <i class="fas fa-envelope"></i>
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="form-control"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">
                <i class="fas fa-lock"></i>
                Contraseña
              </label>
              <div class="password-input">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="form.password"
                  class="form-control"
                  placeholder="Tu contraseña"
                  required
                />
                <button
                  type="button"
                  @click="togglePassword"
                  class="password-toggle"
                >
                  <i
                    :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  ></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.rememberMe" />
                <span class="checkmark"></span>
                Recordarme
              </label>
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-full"
              :disabled="loading"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-sign-in-alt"></i>
              {{ loading ? "Iniciando sesión..." : "Iniciar Sesión" }}
            </button>
          </form>

          <div class="auth-footer">
            <p>
              ¿No tienes una cuenta?
              <router-link to="/register" class="auth-link"
                >Regístrate aquí</router-link
              >
            </p>
          </div>

          <!-- Demo credentials info -->
          <div class="demo-info">
            <h4><i class="fas fa-info-circle"></i> Credenciales de Demo</h4>
            <p><strong>Email:</strong> admin@cafe.com</p>
            <p><strong>Contraseña:</strong> 123456</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const form = ref({
      email: "",
      password: "",
      rememberMe: false,
    });

    const loading = ref(false);
    const showPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const handleLogin = async () => {
      loading.value = true;

      try {
        const result = await authStore.login({
          email: form.value.email,
          password: form.value.password,
        });

        if (result.success) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error en login:", error);
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      showPassword,
      togglePassword,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: linear-gradient(135deg, #ffe1cc, 70% #cd853f 100%);
}
/*.login-page {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  background: linear-gradient(
      135deg,
      rgba(139, 69, 19, 0.1),
      rgba(210, 105, 30, 0.1)
    ),
    url("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200")
      center/cover;
  background-attachment: fixed;
}*/

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 0;
}

.auth-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.auth-header p {
  color: #666;
  font-size: 1rem;
}

.auth-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: var(--transition);
}

.password-toggle:hover {
  color: var(--primary-color);
  background-color: rgba(139, 69, 19, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.btn-full {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.auth-footer p {
  color: #666;
  margin: 0;
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.auth-link:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

.demo-info {
  background: linear-gradient(
    135deg,
    rgba(139, 69, 19, 0.1),
    rgba(210, 105, 30, 0.1)
  );
  border: 1px solid rgba(139, 69, 19, 0.2);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-top: 1.5rem;
  text-align: center;
}

.demo-info h4 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.demo-info p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .auth-card {
    margin: 1rem;
    padding: 2rem 1.5rem;
  }

  .auth-header h2 {
    font-size: 1.5rem;
  }
}
</style>
