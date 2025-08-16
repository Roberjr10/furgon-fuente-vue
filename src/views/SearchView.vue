<template>
  <div class="row mt-3"  style="padding: 15px;">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-header bg-primary text-white text-center">
          <h4>BUSCAR CAJA</h4>
        </div>
        <div class="card-body">

          <form @submit.prevent="buscar" class="container py-3">
            <div class="row g-3">

              <!-- Campo de selección -->
              <div class="col-12 col-md-6">
                <label for="campo" class="form-label">Buscar por</label>
                <div class="input-group">
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
                    <option value="cajasSinPagar" onselect="true">Cajas Sin pagar</option>
                  </select>
                </div>
              </div>

              <!-- Input de búsqueda -->
              <div class="col-12 col-md-6">
                <label for="termino" class="form-label">Término</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <input type="text" id="termino" v-model="termino" class="form-control" placeholder="Escribe tu búsqueda..." required>
                </div>
              </div>

              <!-- Botón -->
              <div class="col-12 text-center mt-3">
                <button type="submit" class="btn btn-primary w-100 w-md-auto">
                  <i class="fa-solid fa-search"></i> Buscar
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  </div>

  <!-- Resultados -->
  <div class="row"  style="padding: 35px;">
    <div v-if="cajas && cajas.length > 0" class="d-block d-md-none">
      <CardCaja
        v-for="(caja, index) in cajas"
        :key="caja.codigoCaja || index"
        :caja="caja"
        :index="index"
        @eliminar="eliminar"
      />
    </div>
    <div v-else class="col-12 text-center mt-3">
      <p>No se han encontrado cajas.</p>
    </div>
  </div>

</template>

<script>
import { show_alerta } from '../funciones';
import axios from 'axios';
import CardCaja from './CardCaja.vue';

export default {
  components: { CardCaja },
  data() {
    return {
      campo: "",
      termino: "",
      cajas: []  // inicializamos como array
    };
  },
  mounted(){
    document.getElementById("campo").addEventListener("change", function () {
  const buscador = document.getElementById("termino");
  
  if (this.value === "cajasSinPagar") {
    buscador.disabled = true; // Desactiva el input
  } else {
    buscador.disabled = false; // Lo vuelve a activar
  }
});
  },
  methods: {
    buscar() {
      if (!this.campo) {
        show_alerta('Por favor, selecciona un campo.', 'warning', 'campo');
        return;
      }
      if ((!this.termino || this.termino.trim() === '') && this.campo !== 'cajasSinPagar') {
        console.log(this.campo);
        show_alerta('Por favor, rellena un término.', 'warning', 'termino');
        return;
      }
      if (this.campo == 'cajasSinPagar'){

        this.getCajasKeyValor('pagado', 0);
      }else{
      //console.log(`Buscando ${this.campo}: ${this.termino}`);
      this.getCajasKeyValor(this.campo, this.termino);
      }
    },

  getCajasKeyValor(key, valor) {
  const url = `http://127.0.0.1:5000/buscar/key=${encodeURIComponent(key)}/valor=${encodeURIComponent(valor)}`;
  axios.get(url)
    .then(response => {
      console.log('Response data:', response.data);

      // Si la respuesta es un objeto (como en tu ejemplo), lo convertimos a array
      if (response.data && !Array.isArray(response.data)) {
        this.cajas = [response.data]; // <-- aquí lo envolvemos en un array
      } else {
        this.cajas = response.data;
      }

      console.log('Cajas asignadas:', this.cajas);
    })
    .catch(error => {
      console.error('Error en la búsqueda:', error);
      this.cajas = [];
    });
},


    eliminar(codigoCaja) {
      // Implementa la lógica de eliminación o llama a tu función confirmar
      console.log('Eliminar caja con código:', codigoCaja);
    }
  }
};


</script>
