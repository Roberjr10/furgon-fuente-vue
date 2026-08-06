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
                to="/carga-rapida"
                class="nav-link"
                active-class="active"
                @click="closeCollapse"
              >
                Carga rápida
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
              <router-link
                to="/informes"
                class="nav-link"
                active-class="active"
                @click="closeCollapse"
              >
                Informes
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

<style>
:root {
  --bs-primary: #0f6e56 !important;
  --bs-primary-rgb: 15, 110, 86 !important;
  --bs-link-color: #0f6e56 !important;
  --bs-link-color-rgb: 15, 110, 86 !important;
  --bs-link-hover-color: #0b5443 !important;
  --bs-link-hover-color-rgb: 11, 84, 67 !important;
  --bs-body-bg: #f2eee7 !important;
  --bs-body-bg-rgb: 242, 238, 231 !important;
  --bs-body-color: #1f3d36 !important;
  --bs-body-color-rgb: 31, 61, 54 !important;
  --bs-border-color: #e9e2d4 !important;
  --bs-card-bg: #ffffff !important;
  --bs-modal-bg: #ffffff !important;
  --furgon-teal: #0f6e56;
  --furgon-teal-dark: #0b5443;
  --furgon-terracotta: #c05a2e;
  --furgon-terracotta-dark: #9c4623;
}

body {
  background-color: var(--bs-body-bg);
}

.btn-primary {
  --bs-btn-bg: var(--furgon-teal) !important;
  --bs-btn-border-color: var(--furgon-teal) !important;
  --bs-btn-hover-bg: var(--furgon-teal-dark) !important;
  --bs-btn-hover-border-color: var(--furgon-teal-dark) !important;
  --bs-btn-active-bg: var(--furgon-teal-dark) !important;
  --bs-btn-active-border-color: var(--furgon-teal-dark) !important;
  --bs-btn-disabled-bg: var(--furgon-teal) !important;
  --bs-btn-disabled-border-color: var(--furgon-teal) !important;
}
.btn-outline-primary {
  --bs-btn-color: var(--furgon-teal) !important;
  --bs-btn-border-color: var(--furgon-teal) !important;
  --bs-btn-hover-bg: var(--furgon-teal) !important;
  --bs-btn-hover-border-color: var(--furgon-teal) !important;
  --bs-btn-active-bg: var(--furgon-teal) !important;
  --bs-btn-active-border-color: var(--furgon-teal) !important;
}
.form-check-input:checked {
  background-color: var(--furgon-teal) !important;
  border-color: var(--furgon-teal) !important;
}
.form-check-input:focus {
  border-color: var(--furgon-teal) !important;
  box-shadow: 0 0 0 0.25rem rgba(15, 110, 86, 0.25) !important;
}
.form-control:focus,
.form-select:focus {
  border-color: var(--furgon-teal) !important;
  box-shadow: 0 0 0 0.25rem rgba(15, 110, 86, 0.25) !important;
}

.btn-terracotta {
  background-color: var(--furgon-terracotta);
  border-color: var(--furgon-terracotta);
  color: #fff;
}
.btn-terracotta:hover,
.btn-terracotta:active,
.btn-terracotta:focus {
  background-color: var(--furgon-terracotta-dark);
  border-color: var(--furgon-terracotta-dark);
  color: #fff;
}

.bg-terracotta { background-color: var(--furgon-terracotta) !important; color: #fff; }
.badge-pagado { background-color: #dcece4; color: var(--furgon-teal); }
.badge-pendiente { background-color: #fbe3d7; color: var(--furgon-terracotta); }
.caja-card.border-pagado { border-left-color: var(--furgon-teal) !important; }
.caja-card.border-pendiente { border-left-color: var(--furgon-terracotta) !important; }

.section-title {
  color: #fdfdfd;
  background-color: var(--furgon-teal);
  border-bottom: 3px solid var(--furgon-terracotta);
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
}
</style>
*/
