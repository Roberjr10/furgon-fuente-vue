<template>
  <h1 class="text-center fw-bold my-4 text-primary display-5">
    📄 Informes generados
  </h1>

  <div v-if="cargando" class="text-center my-5">
    <div class="spinner-border text-primary" style="width:3rem;height:3rem;" role="status"></div>
    <p class="text-muted fs-5 mt-3">Cargando informes...</p>
  </div>

  <div v-else-if="informes.length === 0" class="text-center my-5 px-3">
    <i class="fa-solid fa-file-pdf fa-3x text-muted mb-3"></i>
    <p class="text-muted fs-4">Todavía no has creado ningún informe.</p>
    <router-link to="/home" class="btn btn-primary btn-lg mt-2">
      <i class="fa-solid fa-list-check"></i> Ir a seleccionar cajas
    </router-link>
  </div>

  <div v-else class="row justify-content-center px-3" style="padding-bottom: 40px;">
    <div class="col-12 col-md-8 col-lg-6">
      <div v-for="informe in informes" :key="informe.id" class="card mb-3 shadow-sm">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <h5 class="mb-0">Informe #{{ informe.id }}</h5>
              <span :class="['badge', informe.tipo === 'con_codigo' ? 'bg-success' : 'bg-primary']">
                {{ informe.tipo === 'con_codigo' ? 'Con código' : 'Completo' }}
              </span>
            </div>
            <p class="text-muted mb-1">{{ formatoFecha(informe.fecha_generado) }}</p>
            <p class="mb-0"><i class="fa-solid fa-box"></i> {{ informe.total_cajas }} caja(s)</p>
          </div>
          <button
            class="btn btn-success btn-lg"
            :disabled="descargando === informe.id"
            @click="descargar(informe)"
          >
            <span v-if="descargando === informe.id" class="spinner-border spinner-border-sm"></span>
            <i v-else class="fa-solid fa-download"></i>
            Descargar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listarInformes, obtenerUrlInformePdf, descargarBlobUrl } from '../utilInformes';
import { show_alerta } from '../funciones';

export default {
  data() {
    return {
      informes: [],
      cargando: true,
      descargando: null
    };
  },
  async mounted() {
    try {
      this.informes = await listarInformes();
    } catch (error) {
      console.error('Error al listar informes:', error);
      if (error.response && error.response.status === 401) {
        this.$router.push('/login');
        return;
      }
      show_alerta('No se pudieron cargar los informes', 'error');
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    async descargar(informe) {
      this.descargando = informe.id;
      try {
        const url = await obtenerUrlInformePdf(informe.id);
        descargarBlobUrl(url, `informe-${informe.id}.pdf`);
      } catch (error) {
        console.error('Error al descargar el informe:', error);
        show_alerta('No se pudo descargar el informe', 'error');
      } finally {
        this.descargando = null;
      }
    },
    formatoFecha(valor) {
      if (!valor) return '';
      const d = new Date(valor);
      if (Number.isNaN(d.getTime())) return valor;
      return d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
  }
};
</script>
