<template>
  <h1 class="text-center fw-bold my-4 text-primary display-4">
    📦 Lista de Cajas
  </h1>

  <div class="row" style="padding: 35px;">
    <div class="col-12 col-md-6 col-lg-4" v-for="(caja, index) in cajas" :key="caja.codigoCaja">
      <CardCaja
        :caja="caja"
        :index="index"
        @eliminar="eliminar"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CardCaja from './CardCaja.vue';
import { confirmar } from '../funciones';

export default {
  components: { CardCaja },
  data() {
    return { cajas: [] };
  },
  async mounted() {
    await this.getCajas();
  },
 

  methods: {
    async getCajas() {
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
      }
    },
    eliminar(codigoCaja) {
      confirmar(codigoCaja);
    }
  }
};
</script>
