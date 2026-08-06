<template>
  <h1 class="text-center fw-bold my-4 text-primary display-5">
    📦 Lista de Cajas
    <span v-if="!cargando && cajas.length" class="fs-4 text-muted">({{ cajas.length }})</span>
  </h1>

  <div v-if="!cargando && cajas.length" class="text-center mb-3">
    <button
      class="btn btn-lg"
      :class="modoSeleccion ? 'btn-secondary' : 'btn-outline-primary'"
      @click="alternarModoSeleccion"
    >
      <i class="fa-solid" :class="modoSeleccion ? 'fa-xmark' : 'fa-list-check'"></i>
      {{ modoSeleccion ? 'Cancelar selección' : 'Seleccionar cajas para informe' }}
    </button>
  </div>

  <!-- Filtro y selección rápida, solo visibles en modo selección -->
  <div v-if="modoSeleccion" class="text-center mb-3 px-3">
    <div class="btn-group mb-2" role="group">
      <button
        v-for="opcion in filtrosCodigo"
        :key="opcion.valor"
        type="button"
        class="btn"
        :class="filtroCodigo === opcion.valor ? 'btn-primary' : 'btn-outline-primary'"
        @click="filtroCodigo = opcion.valor"
      >
        {{ opcion.etiqueta }}
      </button>
    </div>
    <div>
      <button class="btn btn-outline-secondary btn-sm" @click="seleccionarVisibles">
        <i class="fa-solid fa-check-double"></i> Seleccionar las {{ cajasFiltradas.length }} de esta lista
      </button>
    </div>
  </div>

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

  <div v-else-if="modoSeleccion && cajasFiltradas.length === 0" class="text-center my-5 px-3">
    <p class="text-muted fs-5">No hay cajas que coincidan con este filtro.</p>
  </div>

  <div v-else class="row" :style="{ padding: '20px 20px ' + (modoSeleccion && seleccionadas.length ? '150px' : '90px') }">
    <div class="col-12 col-md-6 col-lg-4" v-for="(caja, index) in cajasFiltradas" :key="caja.id">
      <CardCaja
        :caja="caja"
        :index="index"
        :modo-seleccion="modoSeleccion"
        :seleccionada="seleccionadas.includes(caja.id)"
        :informe-previo="cajasIncluidas[caja.id] || null"
        @eliminar="eliminar"
        @toggle-seleccion="toggleSeleccion"
      />
    </div>
  </div>

  <!-- Botón flotante: crear caja sin tener que buscar el menú -->
  <router-link
    v-if="!cargando && !modoSeleccion"
    to="/create"
    class="btn btn-primary btn-lg rounded-circle boton-flotante shadow"
    title="Crear caja"
  >
    <i class="fa-solid fa-plus"></i>
  </router-link>

  <!-- Barra fija: crear informe con lo seleccionado -->
  <div v-if="modoSeleccion && seleccionadas.length" class="barra-informe shadow">
    <span class="fs-5 fw-bold mb-2">{{ seleccionadas.length }} caja(s) seleccionada(s)</span>
    <div class="d-grid gap-2 d-sm-flex">
      <button class="btn btn-primary btn-lg flex-fill" :disabled="creandoInforme" @click="crearInformeSeleccion('completo')">
        <span v-if="creandoInforme === 'completo'" class="spinner-border spinner-border-sm me-1"></span>
        <i v-else class="fa-solid fa-file-lines"></i>
        Informe completo
      </button>
      <button class="btn btn-success btn-lg flex-fill" :disabled="creandoInforme" @click="crearInformeSeleccion('con_codigo')">
        <span v-if="creandoInforme === 'con_codigo'" class="spinner-border spinner-border-sm me-1"></span>
        <i v-else class="fa-solid fa-file-pdf"></i>
        Informe con código
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CardCaja from './CardCaja.vue';
import { confirmar, show_alerta } from '../funciones';
import { crearInforme, obtenerCajasIncluidasEnInformes, obtenerUrlInformePdf, descargarBlobUrl } from '../utilInformes';

export default {
  components: { CardCaja },
  data() {
    return {
      cajas: [],
      cargando: true,
      modoSeleccion: false,
      seleccionadas: [],
      cajasIncluidas: {},
      creandoInforme: false,
      filtroCodigo: 'todas',
      filtrosCodigo: [
        { valor: 'todas', etiqueta: 'Todas' },
        { valor: 'sin', etiqueta: 'Sin código' },
        { valor: 'con', etiqueta: 'Con código' }
      ]
    };
  },
  computed: {
    cajasFiltradas() {
      if (!this.modoSeleccion || this.filtroCodigo === 'todas') return this.cajas;
      if (this.filtroCodigo === 'sin') return this.cajas.filter(c => !c.codigoCaja);
      return this.cajas.filter(c => !!c.codigoCaja);
    }
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
    eliminar(id) {
      const caja = this.cajas.find(c => c.id === id);
      const etiqueta = caja ? (caja.codigoCaja || ('#' + caja.id)) : '';
      confirmar(id, etiqueta);
    },
    async alternarModoSeleccion() {
      this.modoSeleccion = !this.modoSeleccion;
      this.seleccionadas = [];
      this.filtroCodigo = 'todas';
      if (this.modoSeleccion) {
        try {
          this.cajasIncluidas = await obtenerCajasIncluidasEnInformes();
        } catch (error) {
          console.error('Error al consultar cajas ya incluidas en informes:', error);
        }
      }
    },
    toggleSeleccion(id) {
      const i = this.seleccionadas.indexOf(id);
      if (i === -1) {
        this.seleccionadas.push(id);
      } else {
        this.seleccionadas.splice(i, 1);
      }
    },
    seleccionarVisibles() {
      this.seleccionadas = this.cajasFiltradas.map(c => c.id);
    },
    async crearInformeSeleccion(tipo) {
      this.creandoInforme = tipo;
      try {
        const { informe_id } = await crearInforme(this.seleccionadas, tipo);
        const url = await obtenerUrlInformePdf(informe_id);
        descargarBlobUrl(url, `informe-${informe_id}.pdf`);
        show_alerta('Informe creado y descargado', 'success');
        this.modoSeleccion = false;
        this.seleccionadas = [];
      } catch (error) {
        console.error('Error al crear el informe:', error);
        show_alerta('No se pudo crear el informe', 'error');
      } finally {
        this.creandoInforme = false;
      }
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

.barra-informe {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  z-index: 20;
  border-top: 3px solid #0d6efd;
}
</style>
