import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import { auth } from './auth'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Si el token expira o es inválido, cualquier petición devuelve 401:
// cerramos sesión y mandamos al login en vez de dejar la app en un estado roto.
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      auth.logout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

createApp(App).use(store).use(router).mount('#app')

import 'bootstrap/dist/js/bootstrap'