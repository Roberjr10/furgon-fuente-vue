// src/auth.js
import { reactive } from 'vue';

export const auth = reactive({
  token: localStorage.getItem('token') || null,
  login(token) {
    this.token = token;
    localStorage.setItem('token', token);
  },
  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }
});
