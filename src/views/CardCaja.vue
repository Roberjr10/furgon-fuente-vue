<template>
  <div
    class="card mb-3 mt-3 shadow-sm rounded-3 caja-card border-start border-4"
    :class="[caja.pagado ? 'border-pagado' : 'border-pendiente', { 'caja-seleccionada': modoSeleccion && seleccionada }]"
    @click="alTocarCard"
  >
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div class="d-flex align-items-center gap-2">
          <input
            v-if="modoSeleccion"
            type="checkbox"
            class="form-check-input seleccion-checkbox"
            :checked="seleccionada"
            @click.stop="$emit('toggle-seleccion', caja.id)"
          >
          <h5 class="fw-bold text-primary mb-0">
            <template v-if="caja.codigoCaja">{{ caja.codigoCaja }}</template>
            <span v-else class="fst-italic text-muted">Sin código</span>
          </h5>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button
            v-if="!modoSeleccion"
            type="button"
            class="photo-btn"
            title="Ver fotos"
            aria-label="Ver fotos"
            @click.stop="verFoto"
          >
            <i class="fa-solid fa-camera"></i>
          </button>
          <span :class="['badge fs-6', caja.pagado ? 'badge-pagado' : 'badge-pendiente']">
            {{ caja.pagado ? 'Pagado' : 'Pendiente' }}
          </span>
        </div>
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

      <template v-if="modoSeleccion">
        <p v-if="informePrevio" class="text-warning-emphasis bg-warning-subtle rounded p-2 mb-0 small">
          <i class="fa-solid fa-triangle-exclamation"></i>
          Ya estaba en el informe #{{ informePrevio.informe_id }} del {{ formatoFecha(informePrevio.fecha_generado) }}
        </p>
      </template>

      <template v-else>
        <p class="text-primary text-end mb-0 small">
          Toca la caja para ver todos los datos <i class="fa-solid fa-chevron-right"></i>
        </p>

        <!-- Acciones: no deben abrir el modal de ver -->
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-end mt-3" @click.stop>
          <router-link
            :to="{ path: 'edit/' + caja.id }"
            class="btn btn-outline-warning"
            title="Editar"
          >
            <i class="fa-solid fa-pen"></i> Editar
          </router-link>
          <button class="btn btn-outline-danger" title="Eliminar" @click="$emit('eliminar', caja.id)">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </template>

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
              <h4 class="modal-title">Caja {{ caja.codigoCaja || ('#' + caja.id) }}</h4>
              <button type="button" class="btn-close btn-close-white" @click="cerrarModal"></button>
            </div>
            <div class="modal-body fs-5">

              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="mb-0">{{ formatoImporte(caja.importe) }}</h2>
                <span :class="['badge fs-6', caja.pagado ? 'badge-pagado' : 'badge-pendiente']">
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
              <router-link :to="{ path: 'edit/' + caja.id }" class="btn btn-warning btn-lg">
                <i class="fa-solid fa-pen"></i> Editar
              </router-link>
              <button class="btn btn-secondary btn-lg" @click="cerrarModal">
                <i class="fa-solid fa-xmark"></i> Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox: todas las fotos de la caja, con opción de descargar cada una -->
      <div
        v-if="mostrarLightbox"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0,0,0,0.7); padding: 35px;"
        @click.stop
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow-lg rounded-4">
            <div class="modal-header bg-primary text-white">
              <h4 class="modal-title">Fotos de la caja {{ caja.codigoCaja || ('#' + caja.id) }}</h4>
              <button type="button" class="btn-close btn-close-white" @click="cerrarLightbox"></button>
            </div>
            <div class="modal-body text-center">
              <div v-if="cargandoFotoLightbox" class="my-4">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="text-muted fs-5 mt-2">Cargando fotos...</p>
              </div>
              <div v-else-if="fotos.length" class="fotos-lightbox-grid">
                <div v-for="foto in fotos" :key="foto.id" class="foto-lightbox-item">
                  <img :src="foto.url" alt="Foto del paquete" class="foto-lightbox img-thumbnail">
                  <button type="button" class="btn btn-primary btn-sm mt-1" @click="abrirFoto(foto.url)">
                    <i class="fa-solid fa-up-right-from-square"></i> Ver / guardar
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer d-grid gap-2 d-sm-flex justify-content-sm-end">
              <button class="btn btn-secondary btn-lg" @click="cerrarLightbox">
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
import { listarFotosCaja, obtenerUrlFoto } from '../utilFoto';
import { show_alerta } from '../funciones';

export default {
  props: {
    caja: Object,
    index: Number,
    modoSeleccion: { type: Boolean, default: false },
    seleccionada: { type: Boolean, default: false },
    informePrevio: { type: Object, default: null }
  },
  emits: ['eliminar', 'toggle-seleccion'],
  data() {
    return {
      mostrarModal: false,
      mostrarLightbox: false,
      fotos: [],
      fotosIntentadas: false,
      cargandoFotoLightbox: false
    };
  },
  beforeUnmount() {
    this.fotos.forEach(f => URL.revokeObjectURL(f.url));
  },
  methods: {
    alTocarCard() {
      if (this.modoSeleccion) {
        this.$emit('toggle-seleccion', this.caja.id);
      } else {
        this.abrirModal();
      }
    },
    abrirModal() {
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    async verFoto() {
      this.mostrarLightbox = true;
      if (!this.fotosIntentadas) {
        this.cargandoFotoLightbox = true;
        try {
          const ids = await listarFotosCaja(this.caja.id);
          this.fotos = await Promise.all(
            ids.map(async fotoId => ({ id: fotoId, url: await obtenerUrlFoto(fotoId) }))
          );
          this.fotosIntentadas = true;
        } catch (error) {
          console.error('Error al cargar las fotos:', error);
          this.mostrarLightbox = false;
          this.cargandoFotoLightbox = false;
          if (!error.response || error.response.status !== 401) {
            show_alerta('No se pudieron cargar las fotos', 'error');
          }
          // si es 401 (sesion expirada), el interceptor global de axios
          // ya cierra sesion y redirige al login
          return;
        }
        this.cargandoFotoLightbox = false;
      }

      if (!this.fotos.length) {
        this.mostrarLightbox = false;
        show_alerta('Esta caja todavía no tiene fotos', 'info');
      }
    },
    cerrarLightbox() {
      this.mostrarLightbox = false;
    },
    abrirFoto(url) {
      window.open(url, '_blank');
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

.caja-seleccionada {
  background-color: #eaf3f0;
  box-shadow: 0 0 0 3px var(--furgon-teal) !important;
}

.seleccion-checkbox {
  width: 1.6em;
  height: 1.6em;
  cursor: pointer;
}

.photo-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #eaf3f0;
  color: var(--furgon-teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fotos-lightbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  max-height: 65vh;
  overflow-y: auto;
}
.foto-lightbox-item { display: flex; flex-direction: column; align-items: center; }

.foto-lightbox {
  max-width: 100%;
  max-height: 40vh;
  object-fit: contain;
}

.stat-box {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 10px;
}

.section-title {
  color: #fdfdfd;
  background-color: var(--furgon-teal);
  border-bottom: 3px solid var(--furgon-terracotta);
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
