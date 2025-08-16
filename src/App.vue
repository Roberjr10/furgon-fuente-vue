<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <!-- Botón toggler para móviles -->
      <button
        class="navbar-toggler"
        type="button"
        @click="toggleCollapse"
        aria-controls="navbarTogglerDemo03"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Marca / logo -->
      <router-link to="/" class="navbar-brand">
        FURGON FUENTE EL SAZ
      </router-link>

      <!-- Menú colapsable -->
      <div :class="['collapse navbar-collapse', { show: isCollapsed }]" id="navbarTogglerDemo03">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- Si no hay token -->
          <li v-if="!isLogged" class="nav-item">
            <router-link
              to="/login"
              class="nav-link"
              active-class="active"
              @click="closeCollapse"
            >
              Iniciar sesión
            </router-link>
          </li>

          <!-- Si hay token -->
          <template v-else>
            <li class="nav-item">
              <router-link
                to="/home"
                class="nav-link"
                active-class="active"
                exact
                @click="closeCollapse"
              >
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/create"
                class="nav-link"
                active-class="active"
                @click="closeCollapse"
              >
                Crear Caja
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/search"
                class="nav-link"
                active-class="active"
                @click="closeCollapse"
              >
                Buscar Caja
              </router-link>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click="logout">Salir</a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>

  <router-view />
</template>

<script>
import { auth } from "./auth";

export default {
  data() {
    return { isCollapsed: false, auth };
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    closeCollapse() {
      this.isCollapsed = false;
    },
    logout() {
      this.auth.logout();
      this.$router.push('/login');
    }
  },
  computed: {
    isLogged() {
      return !!this.auth.token;
    }
  }
};
</script>

