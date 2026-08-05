// src/auth.js
import { reactive } from 'vue';
import axios from 'axios';

export const auth = reactive({
  token: localStorage.getItem('token') || null,
  login(token) {
    this.token = token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  logout() {
    this.token = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
});

// Restaura el header de autorización en axios al recargar la página,
// ya que los defaults de axios no persisten entre recargas.
if (auth.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
}
