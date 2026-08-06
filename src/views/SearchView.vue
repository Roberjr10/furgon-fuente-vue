<template>
  <div class="row mt-3" style="padding: 15px;">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-primary bg-opacity-50 text-white text-center">
          <h4>Buscar Caja</h4>
        </div>
        <div class="card-body">

          <form @submit.prevent="buscar" class="container py-3">
            <div class="row g-3">

              <!-- Campo de selección -->
              <div class="col-12">
                <label for="campo" class="form-label">Buscar por</label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text">
                    <i class="fa-solid fa-filter"></i>
                  </span>
                  <select id="campo" v-model="campo" class="form-select" required>
                    <option value="">Selecciona un campo...</option>
                    <option value="remitente">Remitente</option>
                    <option value="destinatario">Destinatario</option>
                    <option value="codigoCaja">Código de la caja</option>
                    <option value="telefonoRemitente">Teléfono remitente</option>
                    <option value="telefonoDestinatario">Teléfono destinatario</option>
                    <option value="cajasSinPagar">Cajas sin pagar</option>
                  </select>
                </div>
              </div>

              <!-- Input de búsqueda -->
              <div class="col-12" v-if="campo !== 'cajasSinPagar'">
                <label for="termino" class="form-label">Término</label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <input type="text" id="termino" v-model="termino" class="form-control" placeholder="Escribe tu búsqueda..." required>
                </div>
              </div>

              <!-- Botón -->
              <div class="col-12 mt-2">
                <button type="submit" class="btn btn-primary btn-lg w-100">
                  <i class="fa-solid fa-magnifying-glass"></i> Buscar
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  </div>

  <!-- Resultados -->
  <div v-if="buscado" class="row" style="padding: 0 20px 40px;">
    <div v-if="cajas && cajas.length > 0" class="col-12 col-md-6 col-lg-4 offset-lg-4 offset-md-3" v-for="(caja, index) in cajas" :key="caja.id || index">
      <CardCaja
        :caja="caja"
        :index="index"
        @eliminar="eliminar"
      />
    </div>
    <div v-else class="col-12 text-center my-5 px-3">
      <i class="fa-solid fa-magnifying-glass fa-3x text-muted mb-3"></i>
      <p class="text-muted fs-5">No se han encontrado cajas.</p>
    </div>
  </div>

</template>

<script>
import { show_alerta, confirmar } from '../funciones';
import axios from 'axios';
import CardCaja from './CardCaja.vue';

export default {
  components: { CardCaja },
  data() {
    return {
      campo: "",
      termino: "",
      cajas: [],
      buscado: false
    };
  },
  methods: {
    buscar() {
      if (!this.campo) {
        show_alerta('Por favor, selecciona un campo.', 'warning', 'campo');
        return;
      }
      if (!this.termino.trim() && this.campo !== 'cajasSinPagar') {
        show_alerta('Por favor, rellena un término.', 'warning', 'termino');
        return;
      }
      if (this.campo === 'cajasSinPagar'){
        this.getCajasKeyValor('pagado', 0);
      }else{
        this.getCajasKeyValor(this.campo, this.termino);
      }
    },

    getCajasKeyValor(key, valor) {
      const url = `${process.env.VUE_APP_API_URL}/buscar/key=${encodeURIComponent(key)}/valor=${encodeURIComponent(valor)}`;
      axios.get(url)
        .then(response => {
          this.cajas = Array.isArray(response.data) ? response.data : [response.data];
          this.buscado = true;
        })
        .catch(error => {
          console.error('Error en la búsqueda:', error);
          this.cajas = [];
          this.buscado = true;
        });
    },

    eliminar(id) {
      const caja = this.cajas.find(c => c.id === id);
      const etiqueta = caja ? (caja.codigoCaja || ('#' + caja.id)) : '';
      confirmar(id, etiqueta);
    }
  }
};
</script>
