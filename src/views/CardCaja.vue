<template>
  <div
    class="card mb-3 mt-3 shadow-sm border-2 rounded-3 mobile-card"
    :class="{'mobile-card-alt': index % 2 !== 0}" 
  >
    <div class="card-body">
      <h6 class="fw-bold text-primary mb-2">{{ caja.codigoCaja }}</h6>
      <p class="mb-1"><strong>Remitente:</strong> {{ caja.remitente }}</p>
      <p class="mb-1"><strong>Destinatario:</strong> {{ caja.destinatario }}</p>
      <p class="mb-2">
        <strong>Pagado:</strong>
        <span :class="['badge', caja.pagado ? 'bg-success' : 'bg-danger']">
          {{ caja.pagado ? 'Sí' : 'No' }}
        </span>
      </p>

      <!-- Botones adaptables -->
      <div class="d-flex flex-column flex-sm-row">
        <button class="btn btn-outline-primary btn-sm flex-fill mb-2 mb-sm-0 me-sm-1" @click="abrirModal">
          <i class="fa-solid fa-eye"></i> Ver
        </button>
        <router-link
          :to="{ path: 'edit/' + caja.codigoCaja }"
          class="btn btn-outline-warning btn-sm flex-fill mb-2 mb-sm-0 me-sm-1"
        >
          <i class="fa-solid fa-pen"></i> Editar
        </router-link>
        <button class="btn btn-outline-danger btn-sm flex-fill" @click="$emit('eliminar', caja.codigoCaja)">
          <i class="fa-solid fa-trash"></i> Eliminar
        </button>
      </div>

      <!-- Modal responsive -->
      <div
        v-if="mostrarModal"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0,0,0,0.5);  padding: 35px;"
      >
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content shadow-lg rounded-4">
            <div class="modal-header bg-primary text-white">
              <h4 class="modal-title">DETALLES DEL PRODUCTO</h4>
              <button type="button" class="btn-close btn-close-white" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <!-- Datos remitente -->
                <div class="col-12">
                  <h5 class="section-title">Datos del Remitente</h5>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Remitente</label>
                  <input type="text" class="form-control" :value="caja.remitente" readonly>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Fecha</label>
                  <input type="date" class="form-control" :value=" new Date(caja.fecha).toISOString().split('T')[0]" readonly>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Teléfono remitente</label>
                  <input type="tel" class="form-control" :value="caja.telefonoRemitente" readonly>
                </div>

                <!-- Datos destinatario -->
                <div class="col-12 mt-4">
                  <h5 class="section-title">Datos del Destinatario</h5>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Destinatario</label>
                  <input type="text" class="form-control" :value="caja.destinatario" readonly>
                </div>
                <div class="col-12">
                  <label class="form-label">Dirección</label>
                  <input type="text" class="form-control" :value="caja.direccion" readonly>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Teléfono destinatario</label>
                  <input type="tel" class="form-control" :value="caja.telefonoDestinatario" readonly>
                </div>

                <!-- Detalles paquete -->
                <div class="col-12 mt-4">
                  <h5 class="section-title">Detalles del Paquete</h5>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Código de la caja</label>
                  <input type="text" class="form-control" :value="caja.codigoCaja" readonly>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Fecha de Pago</label>
                  <input type="date" class="form-control" :value="caja.fechaPagado ? new Date(caja.fechaPagado).toISOString().split('T')[0] : ''" readonly>
                </div>
                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <input type="text" class="form-control" :value="caja.descripcion" readonly>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Pagado</label>
                  <input type="text" class="form-control" :value="caja.pagado ? 'Sí' : 'No'" readonly>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Importe total</label>
                  <input type="text" class="form-control" :value="caja.importe" readonly>
                </div>
                   <div class="col-12 col-sm-6">
                  <label class="form-label">Importe pagado</label>
                  <input type="text" class="form-control" :value="caja.importePagado" readonly>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Importe pagar furgón</label>
                  <input type="text" class="form-control" :value="caja.importeCrini" readonly>
                </div>
                <div class="col-12 col-sm-6">
                  <label class="form-label">Código comprobante</label>
                  <input type="text" class="form-control" :value="caja.codigoComprobante" readonly>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="cerrarModal">
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
export default {
  props: {
    caja: Object,
    index: Number
  },
  data() {
    return {
      mostrarModal: false
    };
  },
  methods: {
    abrirModal() {
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    }
  }
};
</script>

<style scoped>
@media (max-width: 576px) {
  .card-body {
    padding: 0.8rem;
  }
  h6 {
    font-size: 1rem;
  }
}
</style>
