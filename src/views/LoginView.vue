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
        const response = await fetch('http://127.0.0.1:5000/login', {
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
  background: #ffffff; /* fondo blanco */
}

.login-card {
  background: #ffffff;
  border-radius: 12px;
  border: 2px solid #0d6efd; /* borde azul sólido */
  box-shadow: 0 0 15px rgba(13, 110, 253, 0.3); /* sombra azul */
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
  border-color: #0d6efd;
  box-shadow: 0 0 5px rgba(13, 110, 253, 0.5);
}

.btn-hover:hover {
  background-color: #0b5ed7;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}
</style>