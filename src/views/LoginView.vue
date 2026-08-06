<template>
  <div class="login-page d-flex justify-content-center align-items-center vh-100">
    <div class="login-card p-4 shadow-sm">
      <h2 class="text-center mb-4 text-primary">
        <i class="fas fa-box-open"></i> Iniciar Sesión
      </h2>
      <form @submit.prevent="login">
        <div class="mb-3">
          <input
            v-model="username"
            type="text"
            placeholder="Usuario"
            class="form-control input-custom"
            required
          />
        </div>
        <div class="mb-3">
          <input
            v-model="password"
            type="password"
            placeholder="Contraseña"
            class="form-control input-custom"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100 btn-hover">
          Entrar
        </button>
      </form>
      <p v-if="error" class="text-danger mt-3 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { auth } from '../auth';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch( `${process.env.VUE_APP_API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password })
        });
        const data = await response.json();
        if (response.ok) {
          auth.login(data.token);
          this.$router.push('/');
        } else {
          this.error = data.error;
        }
      } catch (err) {
        this.error = 'Error de conexión';
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  background: var(--bs-body-bg);
}

.login-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1.5px solid #e9e2d4;
  box-shadow: 0 4px 20px rgba(31, 61, 54, 0.12);
  max-width: 400px;
  width: 90%;
}

.input-custom {
  border-radius: 50px;
  border: 1px solid #ced4da;
  padding: 10px 20px;
  transition: border 0.3s, box-shadow 0.3s;
}

.input-custom:focus {
  border-color: var(--furgon-teal);
  box-shadow: 0 0 5px rgba(15, 110, 86, 0.5);
}

.btn-hover:hover {
  background-color: var(--furgon-teal-dark);
  box-shadow: 0 4px 10px rgba(15, 110, 86, 0.3);
}
</style>