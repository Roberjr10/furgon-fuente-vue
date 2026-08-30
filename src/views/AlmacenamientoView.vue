<template>
  <h1 class="text-center fw-bold my-4 text-primary display-5">
    💾 Almacenamiento de fotos
  </h1>

  <div v-if="cargando" class="text-center my-5">
    <div class="spinner-border text-primary" style="width:3rem;height:3rem;" role="status"></div>
    <p class="text-muted fs-5 mt-3">Calculando...</p>
  </div>

  <div v-else class="row justify-content-center px-3" style="padding-bottom: 40px;">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="card shadow-sm text-center">
        <div class="card-body py-5">
          <i class="fa-solid fa-images fa-3x text-primary mb-3"></i>
          <h2 class="fw-bold mb-1">{{ tamanoLegible }}</h2>
          <p class="text-muted fs-5 mb-0">
            en {{ datos.cantidad }} foto{{ datos.cantidad === 1 ? '' : 's' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { obtenerAlmacenamientoFotos } from '../utilFoto';
import { show_alerta } from '../funciones';

export default {
  data() {
    return {
      cargando: true,
      datos: { cantidad: 0, bytes: 0 }
    };
  },
  computed: {
    tamanoLegible() {
      const bytes = this.datos.bytes;
      if (bytes < 1024) return `${bytes} B`;
      const unidades = ['KB', 'MB', 'GB'];
      let valor = bytes / 1024;
      let i = 0;
      while (valor >= 1024 && i < unidades.length - 1) {
        valor /= 1024;
        i++;
      }
      return `${valor.toFixed(1)} ${unidades[i]}`;
    }
  },
  async mounted() {
    try {
      this.datos = await obtenerAlmacenamientoFotos();
    } catch {
      show_alerta('No se pudo cargar el almacenamiento', 'error');
    } finally {
      this.cargando = false;
    }
  }
};
</script>
