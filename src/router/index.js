import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CreateView from '../views/CreateView.vue';
import EditView from '../views/EditView.vue';
import SearchView from '../views/SearchView.vue';
import InformesView from '../views/InformesView.vue';
import LoginView from '../views/LoginView.vue';
import CargaRapidaView from '../views/CargaRapidaView.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },

  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiereAuth: true } // 🔒 protegida
  },
    {
    path: '/home',
    name: 'home2',
    component: HomeView,
    meta: { requiereAuth: true } // 🔒 protegida
  },
  {
    path: '/create',
    name: 'create',
    component: CreateView,
    meta: { requiereAuth: true } // 🔒 protegida
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: EditView,
    meta: { requiereAuth: true } // 🔒 protegida
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { requiereAuth: true } // 🔒 protegida
  },
  {
    path: '/informes',
    name: 'informes',
    component: InformesView,
    meta: { requiereAuth: true } // 🔒 protegida
  },
  {
    path: '/carga-rapida',
    name: 'carga-rapida',
    component: CargaRapidaView,
    meta: { requiereAuth: true } // 🔒 protegida
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// 🔍 Guard global para proteger rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiereAuth && !token) {
    next('/login'); // si no hay token, ir a login
  } else {
    next(); // si hay token o la ruta no requiere auth, continuar
  }
});

export default router;
