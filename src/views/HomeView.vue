<template>
  <h1 class="text-center fw-bold my-4 text-primary display-5">
    📦 Lista de Cajas
    <span v-if="!cargando && cajas.length" class="fs-4 text-muted">({{ cajas.length }})</span>
  </h1>

  <div v-if="cargando" class="text-center my-5">
    <div class="spinner-border text-primary" style="width:3rem;height:3rem;" role="status"></div>
    <p class="text-muted fs-5 mt-3">Cargando cajas...</p>
  </div>

  <div v-else-if="cajas.length === 0" class="text-center my-5 px-3">
    <i class="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
    <p class="text-muted fs-4">Todavía no hay ninguna caja registrada.</p>
    <router-link to="/create" class="btn btn-primary btn-lg mt-2">
      <i class="fa-solid fa-plus"></i> Crear la primera caja
    </router-link>
  </div>

  <div v-else class="row" style="padding: 20px 20px 90px;">
    <div class="col-12 col-md-6 col-lg-4" v-for="(caja, index) in cajas" :key="caja.codigoCaja">
      <CardCaja
        :caja="caja"
        :index="index"
        @eliminar="eliminar"
      />
    </div>
  </div>

  <!-- Botón flotante: crear caja sin tener que buscar el menú -->
  <router-link
    v-if="!cargando"
    to="/create"
    class="btn btn-primary btn-lg rounded-circle boton-flotante shadow"
    title="Crear caja"
  >
    <i class="fa-solid fa-plus"></i>
  </router-link>
</template>

<script>
import axios from 'axios';
import CardCaja from './CardCaja.vue';
import { confirmar } from '../funciones';

export default {
  components: { CardCaja },
  data() {
    return { cajas: [], cargando: true };
  },
  async mounted() {
    await this.getCajas();
  },

  methods: {
    async getCajas() {
      this.cargando = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get( `${process.env.VUE_APP_API_URL}/`, {
          headers: {
            Authorization: `Bearer ${token}` // 🔑 Incluye el JWT
          }
        });
        this.cajas = res.data;
      } catch (err) {
        console.error('Error al obtener cajas:', err);
        if (err.response && err.response.status === 401) {
          // Si el token es inválido o expiró, redirige al login
          this.$router.push('/login');
        }
      } finally {
        this.cargando = false;
      }
    },
    eliminar(codigoCaja) {
      confirmar(codigoCaja);
    }
  }
};
</script>

<style scoped>
.boton-flotante {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}
</style>
