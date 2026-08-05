<template>
  <div
    class="card mb-3 mt-3 shadow-sm rounded-3 caja-card border-start border-4"
    :class="caja.pagado ? 'border-success' : 'border-danger'"
    @click="abrirModal"
  >
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="fw-bold text-primary mb-0">{{ caja.codigoCaja }}</h5>
        <span :class="['badge fs-6', caja.pagado ? 'bg-success' : 'bg-danger']">
          {{ caja.pagado ? 'Pagado' : 'Pendiente' }}
        </span>
      </div>

      <p class="mb-2 fs-6">
        <i class="fa-solid fa-user text-muted me-1"></i>{{ caja.remitente }}
        <i class="fa-solid fa-arrow-right-long text-muted mx-1"></i>
        <i class="fa-solid fa-user text-muted me-1"></i>{{ caja.destinatario }}
      </p>

      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold fs-4">{{ formatoImporte(caja.importe) }}</span>
        <span class="text-muted">{{ formatoFecha(caja.fecha) }}</span>
      </div>

      <p class="text-primary text-end mb-0 small">
        Toca la caja para ver todos los datos <i class="fa-solid fa-chevron-right"></i>
      </p>

      <!-- Acciones: no deben abrir el modal de ver -->
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-end mt-3" @click.stop>
        <router-link
          :to="{ path: 'edit/' + caja.codigoCaja }"
          class="btn btn-outline-warning"
          title="Editar"
        >
          <i class="fa-solid fa-pen"></i> Editar
        </router-link>
        <button class="btn btn-outline-danger" title="Eliminar" @click="$emit('eliminar', caja.codigoCaja)">
          <i class="fa-solid fa-trash"></i> Eliminar
        </button>
      </div>

      <!-- Modal de detalle -->
      <div
        v-if="mostrarModal"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0,0,0,0.5); padding: 35px;"
        @click.stop
      >
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content shadow-lg rounded-4">
            <div class="modal-header bg-primary text-white">
              <h4 class="modal-title">Caja {{ caja.codigoCaja }}</h4>
              <button type="button" class="btn-close btn-close-white" @click="cerrarModal"></button>
            </div>
            <div class="modal-body fs-5">

              <div v-if="cargandoFoto" class="text-center mb-3">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span class="text-muted ms-2">Cargando foto...</span>
              </div>
              <div v-else-if="fotoUrl" class="text-center mb-3">
                <img :src="fotoUrl" alt="Foto del paquete" class="foto-detalle img-thumbnail">
              </div>

              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="mb-0">{{ formatoImporte(caja.importe) }}</h2>
                <span :class="['badge fs-6', caja.pagado ? 'bg-success' : 'bg-danger']">
                  {{ caja.pagado ? 'Pagado' : 'Pendiente de pago' }}
                </span>
              </div>

              <div class="row g-2 text-center mb-4">
                <div class="col-6">
                  <div class="stat-box">
                    <div class="text-muted small">Pagar furgón</div>
                    <div class="fw-bold fs-5">{{ formatoImporte(caja.importeCrini) }}</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-box">
                    <div class="text-muted small">Importe pagado</div>
                    <div class="fw-bold fs-5">{{ formatoImporte(caja.importePagado) }}</div>
                  </div>
                </div>
              </div>

              <h6 class="section-title">Remitente</h6>
              <p class="mb-1">{{ caja.remitente }}</p>
              <p class="text-muted mb-3"><i class="fa-solid fa-phone me-1"></i>{{ caja.telefonoRemitente }}</p>

              <h6 class="section-title">Destinatario</h6>
              <p class="mb-1">{{ caja.destinatario }}</p>
              <p class="text-muted mb-1"><i class="fa-solid fa-phone me-1"></i>{{ caja.telefonoDestinatario }}</p>
              <p class="text-muted mb-3"><i class="fa-solid fa-location-dot me-1"></i>{{ caja.direccion }}</p>

              <h6 class="section-title">Paquete</h6>
              <p class="mb-1">{{ caja.descripcion }}</p>
              <p class="text-muted mb-0">
                <i class="fa-solid fa-calendar-day me-1"></i>{{ formatoFecha(caja.fecha) }}
                <span v-if="caja.pagado"> · Pagado el {{ formatoFecha(caja.fechaPagado) }}</span>
              </p>

            </div>
            <div class="modal-footer d-grid gap-2 d-sm-flex justify-content-sm-end">
              <router-link :to="{ path: 'edit/' + caja.codigoCaja }" class="btn btn-warning btn-lg">
                <i class="fa-solid fa-pen"></i> Editar
              </router-link>
              <button class="btn btn-secondary btn-lg" @click="cerrarModal">
                <i class="fa-solid fa-xmark"></i> Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { obtenerUrlFotoCaja } from '../utilFoto';

export default {
  props: {
    caja: Object,
    index: Number
  },
  data() {
    return {
      mostrarModal: false,
      fotoUrl: null,
      cargandoFoto: false
    };
  },
  beforeUnmount() {
    if (this.fotoUrl) URL.revokeObjectURL(this.fotoUrl);
  },
  methods: {
    async abrirModal() {
      this.mostrarModal = true;
      if (this.fotoUrl === null && !this.cargandoFoto) {
        this.cargandoFoto = true;
        try {
          this.fotoUrl = await obtenerUrlFotoCaja(this.caja.codigoCaja);
        } catch (error) {
          console.error('Error al cargar la foto:', error);
        } finally {
          this.cargandoFoto = false;
        }
      }
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    formatoImporte(valor) {
      const n = Number(valor);
      if (Number.isNaN(n)) return valor;
      return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    },
    formatoFecha(valor) {
      if (!valor) return '';
      const d = new Date(valor);
      if (Number.isNaN(d.getTime())) return valor;
      return d.toLocaleDateString('es-ES');
    }
  }
};
</script>

<style scoped>
.caja-card {
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.caja-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15) !important;
}

.foto-detalle {
  max-width: 100%;
  max-height: 280px;
  object-fit: contain;
}

.stat-box {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 10px;
}

.section-title {
  color: #fdfdfd;
  background-color: #0e0586;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.9rem;
}

@media (max-width: 576px) {
  .card-body {
    padding: 0.8rem;
  }
  h6 {
    font-size: 1rem;
  }
}
</style>
