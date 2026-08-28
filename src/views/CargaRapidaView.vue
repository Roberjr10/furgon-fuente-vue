<template>
  <div class="carga-rapida">

    <div class="cr-hdr">
      <h4 class="mb-1">Carga rápida</h4>
      <p class="mb-0">
        <span v-if="cajasGuardadas.length">{{ cajasGuardadas.length }} caja(s) guardada(s) · seguí agregando</span>
        <span v-else>Cargá varias cajas seguidas sin repetir los datos del remitente</span>
      </p>
    </div>

    <div class="container py-3" style="max-width:560px;">

      <div v-if="cajasGuardadas.length" class="mb-3">
        <p class="cr-section-label">Ya guardadas</p>
        <div v-for="(c, index) in cajasGuardadas" :key="index" class="cr-done-card" :class="{ 'is-pagado': c.pagado }">
          <div class="cr-done-top">
            <span :class="['cr-code', { muted: !c.codigoCaja }]">{{ c.codigoCaja || 'Sin código' }}</span>
            <span :class="['cr-badge', c.pagado ? 'ok' : 'pend']">{{ c.pagado ? 'Pagado' : 'Pendiente' }}</span>
            <span class="cr-row-actions">
              <button type="button" title="Editar" aria-label="Editar" @click="editarCaja(index)">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button" title="Eliminar" aria-label="Eliminar" @click="eliminarCaja(index)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </span>
          </div>
          <div class="cr-done-bottom">
            <span>{{ c.destinatario }} · {{ c.direccion }}</span>
            <span class="amount">{{ formatoImporte(c.importe) }}</span>
          </div>
        </div>
      </div>

      <p class="cr-section-label d-flex justify-content-between">
        <span>{{ editIndex === null ? 'Caja nueva' : 'Editando caja' }}</span>
        <span v-if="editIndex === null">#{{ cajasGuardadas.length + 1 }}</span>
      </p>

      <form @submit="guardarCaja" novalidate class="cr-open-card">

        <p class="cr-subhead">Remitente <span v-if="remitente" class="text-muted fw-normal text-uppercase" style="letter-spacing:0;">(precargado)</span></p>
        <div class="cr-field">
          <label for="cr-remitente">Remitente <span class="text-danger">*</span></label>
          <div class="cr-input-group" :class="{ prefilled: remitente }">
            <i class="fa-solid fa-user"></i>
            <input id="cr-remitente" v-model="remitente" type="text" maxlength="50" placeholder="Nombre del remitente" required>
          </div>
        </div>
        <div class="row g-2">
          <div class="col-6">
            <div class="cr-field">
              <label for="cr-documento">Documento <span class="opt">(op.)</span></label>
              <div class="cr-input-group" :class="{ prefilled: documentoRemitente }">
                <i class="fa-solid fa-id-card"></i>
                <input id="cr-documento" v-model="documentoRemitente" type="text" maxlength="50" placeholder="DNI, cédula...">
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="cr-field">
              <label for="cr-tel-remitente">Teléfono <span class="text-danger">*</span></label>
              <div class="cr-input-group" :class="{ prefilled: telefonoRemitente }">
                <i class="fa-solid fa-phone"></i>
                <input id="cr-tel-remitente" v-model="telefonoRemitente" type="tel" inputmode="tel" maxlength="15" placeholder="600 123 456" required>
              </div>
            </div>
          </div>
        </div>

        <p class="cr-subhead">Destinatario</p>
        <div class="cr-field">
          <label for="cr-destinatario">Destinatario <span class="text-danger">*</span></label>
          <div class="cr-input-group">
            <i class="fa-solid fa-user"></i>
            <input id="cr-destinatario" ref="primerCampo" v-model="destinatario" type="text" maxlength="50" placeholder="Nombre del destinatario" required>
          </div>
        </div>
        <div class="cr-field">
          <label for="cr-tel-destinatario">Teléfono destinatario <span class="text-danger">*</span></label>
          <div class="cr-input-group">
            <i class="fa-solid fa-phone"></i>
            <input id="cr-tel-destinatario" v-model="telefonoDestinatario" type="tel" inputmode="tel" maxlength="15" placeholder="Ej: 600 987 654" required>
          </div>
        </div>
        <div class="cr-field">
          <label for="cr-direccion">Dirección <span class="text-danger">*</span></label>
          <div class="cr-input-group">
            <i class="fa-solid fa-location-dot"></i>
            <input id="cr-direccion" v-model="direccion" type="text" maxlength="100" placeholder="Dirección del destinatario" required>
          </div>
        </div>

        <p class="cr-subhead">Paquete</p>
        <div class="row g-2">
          <div class="col-6">
            <div class="cr-field">
              <label for="cr-codigo">Código <span class="opt">(op.)</span></label>
              <div class="cr-input-group">
                <i class="fa-solid fa-barcode"></i>
                <input id="cr-codigo" v-model="codigoCaja" type="text" maxlength="50" placeholder="Ej: 18101411">
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="cr-field">
              <label for="cr-fecha">Fecha <span class="text-danger">*</span></label>
              <div class="cr-input-group" :class="{ prefilled: fecha }">
                <i class="fa-solid fa-calendar-day"></i>
                <input id="cr-fecha" v-model="fecha" type="date" required>
              </div>
            </div>
          </div>
        </div>
        <div class="cr-field">
          <label for="cr-descripcion">Descripción <span class="text-danger">*</span></label>
          <div class="cr-input-group">
            <i class="fa-solid fa-box"></i>
            <input id="cr-descripcion" v-model="descripcion" type="text" maxlength="100" placeholder="Descripción del paquete" required>
          </div>
        </div>
        <div class="row g-2">
          <div class="col-6">
            <div class="cr-field">
              <label for="cr-importe">Importe total <span class="text-danger">*</span></label>
              <div class="cr-input-group">
                <i class="fa-solid fa-dollar-sign"></i>
                <input id="cr-importe" v-model="importe" type="number" inputmode="decimal" step="0.01" min="0" placeholder="Ej: 75.00" required>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="cr-field">
              <label for="cr-importe-crini">Pagar furgón <span class="text-danger">*</span></label>
              <div class="cr-input-group">
                <i class="fa-solid fa-dollar-sign"></i>
                <input id="cr-importe-crini" v-model="importeCrini" type="number" inputmode="decimal" step="0.01" min="0" placeholder="Ej: 60.00" required>
              </div>
            </div>
          </div>
        </div>

        <div class="cr-field">
          <div v-if="fotoPreviewUrl" class="mb-2 text-center">
            <img :src="fotoPreviewUrl" alt="Foto del paquete" class="cr-foto-preview img-thumbnail">
          </div>
          <button type="button" class="cr-foto-btn" @click="$refs.inputFoto.click()">
            <i class="fa-solid fa-camera"></i> {{ fotoPreviewUrl ? 'Cambiar foto' : 'Hacer foto' }} <span class="opt">(opcional)</span>
          </button>
          <input ref="inputFoto" type="file" accept="image/*" capture="environment" class="d-none" @change="onFotoSeleccionada">
        </div>

        <div class="cr-toggle-row">
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" role="switch" id="cr-pagado" v-model="yaPagado" @change="onCambioPagado">
          </div>
          <label for="cr-pagado" class="mb-0">Ya está pagado</label>
        </div>

        <template v-if="yaPagado">
          <div class="row g-2">
            <div class="col-6">
              <div class="cr-field">
                <label for="cr-importe-pagado">Importe pagado <span class="text-danger">*</span></label>
                <div class="cr-input-group">
                  <i class="fa-solid fa-dollar-sign"></i>
                  <input id="cr-importe-pagado" v-model="importePagado" type="number" inputmode="decimal" step="0.01" min="0" required>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="cr-field">
                <label for="cr-fecha-pagado">Fecha de pago <span class="text-danger">*</span></label>
                <div class="cr-input-group">
                  <i class="fa-solid fa-calendar-day"></i>
                  <input id="cr-fecha-pagado" v-model="fechaPagado" type="date" required>
                </div>
              </div>
            </div>
          </div>
        </template>

        <button type="submit" class="cr-btn-save">
          <i class="fa-solid fa-check"></i>
          {{ editIndex === null ? 'Guardar y cargar la próxima' : 'Guardar cambios' }}
        </button>
      </form>
    </div>

    <div class="cr-bottom-bar">
      <button type="button" class="btn btn-terracotta btn-lg w-100" :disabled="enviando" @click="enviarLote">
        <span v-if="enviando" class="spinner-border spinner-border-sm me-1"></span>
        <i v-else class="fa-solid fa-paper-plane"></i>
        {{ enviando ? 'Enviando...' : `Enviar ${totalAEnviar} caja(s)` }}
      </button>
      <small>Se guardan todas juntas al final</small>
    </div>

  </div>
</template>

<script>
import { show_alerta } from '../funciones';
import { comprimirImagen, subirFotoCaja } from '../utilFoto';
import axios from 'axios';

function camposVacios() {
  return {
    codigoCaja: '', destinatario: '', direccion: '', telefonoDestinatario: '',
    descripcion: '', importe: '', importeCrini: '',
    yaPagado: false, fechaPagado: '', importePagado: '',
    fotoBlob: null, fotoPreviewUrl: null
  };
}

export default {
  data() {
    return {
      cajasGuardadas: [],
      editIndex: null,
      enviando: false,
      remitente: '',
      documentoRemitente: '',
      telefonoRemitente: '',
      fecha: new Date().toISOString().split('T')[0],
      ...camposVacios()
    };
  },
  computed: {
    totalAEnviar() {
      return this.cajasGuardadas.length + (this.formTieneContenido() ? 1 : 0);
    }
  },
  beforeUnmount() {
    if (this.fotoPreviewUrl) URL.revokeObjectURL(this.fotoPreviewUrl);
    this.cajasGuardadas.forEach(c => { if (c.fotoPreviewUrl) URL.revokeObjectURL(c.fotoPreviewUrl); });
  },
  methods: {
    formatoImporte(valor) {
      const n = Number(valor);
      if (Number.isNaN(n)) return valor;
      return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    },
    onCambioPagado() {
      if (this.yaPagado) {
        this.fechaPagado = this.fechaPagado || new Date().toISOString().split('T')[0];
        this.importePagado = this.importePagado || this.importe;
      }
    },
    async onFotoSeleccionada(event) {
      const archivo = event.target.files[0];
      if (!archivo) return;
      try {
        this.fotoBlob = await comprimirImagen(archivo);
        if (this.fotoPreviewUrl) URL.revokeObjectURL(this.fotoPreviewUrl);
        this.fotoPreviewUrl = URL.createObjectURL(this.fotoBlob);
      } catch (error) {
        show_alerta('No se pudo procesar la foto', 'error');
      }
    },
    formTieneContenido() {
      return !!(this.destinatario || this.direccion || this.telefonoDestinatario || this.descripcion || this.importe || this.importeCrini || this.codigoCaja);
    },
    construirCajaDesdeFormulario() {
      return {
        codigoCaja: this.codigoCaja,
        remitente: this.remitente,
        documentoRemitente: this.documentoRemitente,
        fecha: this.fecha,
        telefonoRemitente: this.telefonoRemitente,
        destinatario: this.destinatario,
        direccion: this.direccion,
        telefonoDestinatario: this.telefonoDestinatario,
        descripcion: this.descripcion,
        pagado: this.yaPagado ? 1 : 0,
        importe: this.importe,
        importeCrini: this.importeCrini,
        fechaPagado: this.yaPagado ? this.fechaPagado : '',
        importePagado: this.yaPagado ? this.importePagado : 0,
        fotoBlob: this.fotoBlob,
        fotoPreviewUrl: this.fotoPreviewUrl
      };
    },
    limpiarFormulario() {
      Object.assign(this.$data, camposVacios());
      this.$nextTick(() => {
        if (this.$refs.primerCampo) this.$refs.primerCampo.focus();
      });
    },
    guardarCaja(event) {
      event.preventDefault();
      const form = event.target;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const caja = this.construirCajaDesdeFormulario();
      if (this.editIndex === null) {
        this.cajasGuardadas.push(caja);
      } else {
        this.cajasGuardadas.splice(this.editIndex, 0, caja);
        this.editIndex = null;
      }
      this.limpiarFormulario();
    },
    editarCaja(index) {
      const c = this.cajasGuardadas[index];
      this.codigoCaja = c.codigoCaja;
      this.destinatario = c.destinatario;
      this.direccion = c.direccion;
      this.telefonoDestinatario = c.telefonoDestinatario;
      this.descripcion = c.descripcion;
      this.importe = c.importe;
      this.importeCrini = c.importeCrini;
      this.yaPagado = !!c.pagado;
      this.fechaPagado = c.fechaPagado;
      this.importePagado = c.importePagado;
      this.fotoBlob = c.fotoBlob;
      this.fotoPreviewUrl = c.fotoPreviewUrl;
      this.editIndex = index;
      this.cajasGuardadas.splice(index, 1);
      window.scrollTo({ top: document.body.scrollHeight * 0.3, behavior: 'smooth' });
    },
    eliminarCaja(index) {
      const c = this.cajasGuardadas[index];
      if (c.fotoPreviewUrl) URL.revokeObjectURL(c.fotoPreviewUrl);
      this.cajasGuardadas.splice(index, 1);
    },
    async enviarLote() {
      let lista = this.cajasGuardadas;
      if (this.formTieneContenido()) {
        const form = this.$el.querySelector('form');
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        lista = [...lista, this.construirCajaDesdeFormulario()];
      }
      if (lista.length === 0) {
        show_alerta('Agregá al menos una caja antes de enviar', 'warning');
        return;
      }

      this.enviando = true;
      try {
        const payload = {
          cajas: lista.map(({ fotoBlob, fotoPreviewUrl, ...resto }) => resto)
        };
        const respuesta = await axios.post(`${process.env.VUE_APP_API_URL}/crearCajasLote`, payload);
        const ids = respuesta.data.ids || [];

        for (let i = 0; i < lista.length; i++) {
          if (lista[i].fotoBlob && ids[i]) {
            try {
              await subirFotoCaja(ids[i], lista[i].fotoBlob);
            } catch (error) {
              console.error('No se pudo subir una de las fotos:', error);
            }
          }
        }

        show_alerta(`${ids.length} caja(s) guardada(s)`, 'success');
        this.$router.push('/home');
      } catch (error) {
        const mensaje = (error.response && error.response.data && error.response.data.error) || 'No se pudo enviar el lote';
        show_alerta(mensaje, 'error');
      } finally {
        this.enviando = false;
      }
    }
  }
};
</script>

<style scoped>
.carga-rapida {
  padding-bottom: 90px;
}

.cr-hdr {
  background: var(--furgon-teal);
  color: #fff;
  padding: 18px 16px 16px;
}
.cr-hdr p { font-size: 13px; color: #bfe0d5; }

.cr-section-label {
  font-size: 11.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8a8378;
  margin: 0 0 6px 2px;
}

.cr-done-card {
  background: #fff;
  border: 1px solid var(--bs-border-color);
  border-left: 4px solid var(--furgon-terracotta);
  border-radius: 12px;
  padding: 9px 12px;
  margin-top: 8px;
}
.cr-done-card.is-pagado { border-left-color: var(--furgon-teal); }
.cr-done-top { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
.cr-code { font-size: 13px; font-weight: 500; color: #1f3d36; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.cr-code.muted { font-family: inherit; font-style: italic; font-weight: 400; color: #a09a8b; }
.cr-badge { font-size: 10.5px; font-weight: 500; padding: 2px 7px; border-radius: 20px; }
.cr-badge.ok { background: #dcece4; color: var(--furgon-teal); }
.cr-badge.pend { background: #fbe3d7; color: var(--furgon-terracotta); }
.cr-row-actions { margin-left: auto; display: flex; gap: 2px; }
.cr-row-actions button { width: 26px; height: 26px; border: none; background: transparent; color: #a09a8b; display: flex; align-items: center; justify-content: center; }
.cr-done-bottom { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; color: #5c574c; }
.cr-done-bottom span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cr-done-bottom .amount { font-weight: 500; color: #1f3d36; flex-shrink: 0; }

.cr-open-card {
  background: #fff;
  border: 2px solid var(--furgon-teal);
  border-radius: 16px;
  padding: 14px;
}
.cr-subhead {
  font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em;
  color: var(--furgon-teal); margin: 12px 0 7px;
}
.cr-subhead:first-of-type { margin-top: 2px; }

.cr-field { margin-bottom: 10px; min-width: 0; }
.cr-field label { display: flex; justify-content: space-between; font-size: 11.5px; color: #7c7568; margin-bottom: 3px; }
.cr-field label .opt { font-style: italic; }

.cr-input-group {
  display: flex; align-items: center; background: #faf8f4; border: 1px solid var(--bs-border-color);
  border-radius: 10px; padding: 0 10px; height: 42px; min-width: 0;
}
.cr-input-group.prefilled { background: #f2f8f6; border-color: #cfe6de; }
.cr-input-group i { color: #a09a8b; margin-right: 8px; width: 16px; text-align: center; flex-shrink: 0; }
.cr-input-group input {
  border: none; background: transparent; font-size: 14px; color: #1f3d36; flex: 1; outline: none;
  min-width: 0;
}

.cr-foto-preview { max-width: 100%; max-height: 200px; object-fit: contain; }
.cr-foto-btn {
  width: 100%; border: 1.5px solid var(--furgon-teal); color: var(--furgon-teal); background: #fff;
  border-radius: 10px; height: 42px; font-size: 13px; font-weight: 500;
}

.cr-toggle-row { display: flex; align-items: center; gap: 8px; margin: 4px 0 12px; font-size: 13px; color: #3a362f; }

.cr-btn-save {
  width: 100%; border: none; border-radius: 10px; background: var(--furgon-teal); color: #fff;
  font-size: 13.5px; font-weight: 500; padding: 11px; margin-top: 4px;
}

.cr-bottom-bar {
  position: fixed; left: 0; right: 0; bottom: 0; background: #fff; border-top: 1px solid var(--bs-border-color);
  padding: 10px 16px 12px; display: flex; flex-direction: column; align-items: center; gap: 3px; z-index: 20;
}
.cr-bottom-bar small { font-size: 11.5px; color: #a09a8b; }
</style>
