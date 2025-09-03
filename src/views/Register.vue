<template>
  <div class="register-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h2><i class="fas fa-user-plus"></i> Crear Cuenta</h2>
            <p>Únete a nuestra comunidad de amantes del café</p>
          </div>

          <form @submit.prevent="handleRegister" class="auth-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">
                  <i class="fas fa-user"></i>
                  Nombre
                </label>
                <input
                  type="text"
                  id="firstName"
                  v-model="form.firstName"
                  class="form-control"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">
                  <i class="fas fa-user"></i>
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  v-model="form.lastName"
                  class="form-control"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>

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
              <label for="phone" class="form-label">
                <i class="fas fa-phone"></i>
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                v-model="form.phone"
                class="form-control"
                placeholder="+1 234 567 8900"
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
                  placeholder="Mínimo 6 caracteres"
                  required
                  minlength="6"
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
              <div class="password-strength">
                <div class="strength-bar" :class="passwordStrength.class">
                  <div
                    class="strength-fill"
                    :style="{ width: passwordStrength.width }"
                  ></div>
                </div>
                <span class="strength-text">{{ passwordStrength.text }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">
                <i class="fas fa-lock"></i>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                v-model="form.confirmPassword"
                class="form-control"
                placeholder="Repite tu contraseña"
                required
              />
              <div
                v-if="form.confirmPassword && !passwordsMatch"
                class="error-message"
              >
                <i class="fas fa-exclamation-circle"></i>
                Las contraseñas no coinciden
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.acceptTerms" required />
                <span class="checkmark"></span>
                Acepto los
                <a href="#" class="auth-link">términos y condiciones</a>
              </label>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.newsletter" />
                <span class="checkmark"></span>
                Quiero recibir ofertas y novedades por email
              </label>
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-full"
              :disabled="loading || !isFormValid"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-user-plus"></i>
              {{ loading ? "Creando cuenta..." : "Crear Cuenta" }}
            </button>
          </form>

          <div class="auth-footer">
            <p>
              ¿Ya tienes una cuenta?
              <router-link to="/login" class="auth-link"
                >Inicia sesión aquí</router-link
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "Register",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const form = ref({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      newsletter: true,
    });

    const loading = ref(false);
    const showPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const passwordStrength = computed(() => {
      const password = form.value.password;
      if (!password) return { class: "", width: "0%", text: "" };

      let score = 0;
      if (password.length >= 6) score++;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      const levels = [
        { class: "weak", width: "20%", text: "Muy débil" },
        { class: "weak", width: "40%", text: "Débil" },
        { class: "medium", width: "60%", text: "Regular" },
        { class: "strong", width: "80%", text: "Fuerte" },
        { class: "strong", width: "100%", text: "Muy fuerte" },
      ];

      return levels[Math.min(score, 4)];
    });

    const passwordsMatch = computed(() => {
      return form.value.password === form.value.confirmPassword;
    });

    const isFormValid = computed(() => {
      return (
        form.value.firstName &&
        form.value.lastName &&
        form.value.email &&
        form.value.phone &&
        form.value.password.length >= 6 &&
        passwordsMatch.value &&
        form.value.acceptTerms
      );
    });

    const handleRegister = async () => {
      if (!isFormValid.value) return;

      loading.value = true;

      try {
        const result = await authStore.register({
          name: `${form.value.firstName} ${form.value.lastName}`,
          email: form.value.email,
          phone: form.value.phone,
          password: form.value.password,
          newsletter: form.value.newsletter,
        });

        if (result.success) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error en registro:", error);
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      showPassword,
      passwordStrength,
      passwordsMatch,
      isFormValid,
      togglePassword,
      handleRegister,
    };
  },
};
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  /*
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(210, 105, 30, 0.1)),
              url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200') center/cover;
  background-attachment: fixed;
  */
  padding: 2rem 0;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.auth-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background-color: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  transition: var(--transition);
  border-radius: 2px;
}

.strength-bar.weak .strength-fill {
  background-color: var(--danger);
}

.strength-bar.medium .strength-fill {
  background-color: var(--warning);
}

.strength-bar.strong .strength-fill {
  background-color: var(--success);
}

.strength-text {
  font-size: 0.8rem;
  color: #666;
}

.error-message {
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  margin-top: 0.1rem;
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

@media (max-width: 768px) {
  .auth-card {
    margin: 1rem;
    padding: 2rem 1.5rem;
  }

  .auth-header h2 {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
