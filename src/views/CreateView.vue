<template>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-header bg-primary bg-opacity-50 text-white text-center"><h4>Crear Caja</h4></div>
                <div class="card-body pb-0">


<form @submit="guardar" novalidate class="container py-3">
    <div class="row g-3">

        <div class="col-12">
            <label for="codigoCaja" class="form-label">Código de la caja <span class="text-muted fw-normal">(opcional)</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-barcode"></i></span>
                <input ref="primerCampo" type="text" id="codigoCaja" v-model="codigoCaja" class="form-control" maxlength="50" placeholder="Déjalo en blanco si aún no lo tienes" autofocus enterkeyhint="next">
            </div>
        </div>

        <!-- Sección REMITENTE -->
        <div class="col-12 mt-4">
            <h5 class="section-title">Datos del Remitente</h5>
        </div>

        <div class="col-12 position-relative">
            <label for="remitente" class="form-label">Remitente <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                <input
                    type="text" id="remitente" v-model="remitente" class="form-control"
                    maxlength="50" placeholder="Nombre del remitente" enterkeyhint="next" required
                    autocomplete="off"
                    @input="buscarRemitenteDebounced"
                    @blur="ocultarSugerenciasConDelay('remitente')"
                >
            </div>
            <ul v-if="sugerenciasRemitente.length" class="list-group sugerencias-lista">
                <li
                    v-for="(s, i) in sugerenciasRemitente" :key="i"
                    class="list-group-item list-group-item-action"
                    @mousedown.prevent="seleccionarRemitente(s)"
                >
                    <div class="fw-bold">{{ s.remitente }}</div>
                    <div class="text-muted small">{{ s.telefonoRemitente || 'sin teléfono guardado' }}</div>
                </li>
            </ul>
        </div>

        <div class="col-12">
            <label for="documentoRemitente" class="form-label">Documento del remitente <span class="text-muted fw-normal">(opcional)</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-id-card"></i></span>
                <input type="text" id="documentoRemitente" v-model="documentoRemitente" class="form-control" maxlength="50" placeholder="DNI, cédula, pasaporte..." enterkeyhint="next">
            </div>
        </div>

        <div class="col-12">
            <label for="telefonoRemitente" class="form-label">Teléfono remitente <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                <input type="tel" id="telefonoRemitente" v-model="telefonoRemitente" class="form-control" inputmode="tel" maxlength="15" placeholder="Ej: 600 123 456" enterkeyhint="next" required>
            </div>
        </div>

        <!-- Sección DESTINATARIO -->
        <div class="col-12 mt-4">
            <h5 class="section-title">Datos del Destinatario</h5>
        </div>

        <div class="col-12 position-relative">
            <label for="destinatario" class="form-label">Destinatario <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                <input
                    type="text" id="destinatario" v-model="destinatario" class="form-control"
                    maxlength="50" placeholder="Nombre del destinatario" enterkeyhint="next" required
                    autocomplete="off"
                    @input="buscarDestinatarioDebounced"
                    @blur="ocultarSugerenciasConDelay('destinatario')"
                >
            </div>
            <ul v-if="sugerenciasDestinatario.length" class="list-group sugerencias-lista">
                <li
                    v-for="(s, i) in sugerenciasDestinatario" :key="i"
                    class="list-group-item list-group-item-action"
                    @mousedown.prevent="seleccionarDestinatario(s)"
                >
                    <div class="fw-bold">{{ s.destinatario }}</div>
                    <div class="text-muted small">{{ s.telefonoDestinatario || 'sin teléfono' }} · {{ s.direccion || 'sin dirección' }}</div>
                </li>
            </ul>
        </div>

        <div class="col-12">
            <label for="telefonoDestinatario" class="form-label">Teléfono destinatario <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                <input type="tel" id="telefonoDestinatario" v-model="telefonoDestinatario" class="form-control" inputmode="tel" maxlength="15" placeholder="Ej: 600 987 654" enterkeyhint="next" required>
            </div>
        </div>

        <div class="col-12">
            <label for="direccion" class="form-label">Dirección <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-location-dot"></i></span>
                <textarea id="direccion" v-model="direccion" class="form-control" rows="2" maxlength="100" placeholder="Dirección del destinatario" required></textarea>
            </div>
        </div>

        <!-- Sección PAQUETE -->
        <div class="col-12 mt-4">
            <h5 class="section-title">Detalles del Paquete</h5>
        </div>

        <div class="col-12">
            <label class="form-label">Fotos del paquete <span class="text-muted fw-normal">(opcional)</span></label>
            <div v-if="fotos.length" class="fotos-grid mb-2">
                <div v-for="(foto, i) in fotos" :key="i" class="foto-miniatura">
                    <img :src="foto.previewUrl" alt="Foto del paquete">
                    <button type="button" class="foto-quitar" title="Quitar" @click="quitarFoto(i)">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-primary btn-lg flex-fill" @click="$refs.inputFotoCamara.click()">
                    <i class="fa-solid fa-camera"></i> Hacer foto
                </button>
                <button type="button" class="btn btn-outline-primary btn-lg flex-fill" @click="$refs.inputFotoGaleria.click()">
                    <i class="fa-solid fa-image"></i> Subir foto(s)
                </button>
            </div>
            <input ref="inputFotoCamara" type="file" accept="image/*" capture="environment" class="d-none" @change="onFotoSeleccionada">
            <input ref="inputFotoGaleria" type="file" accept="image/*" multiple class="d-none" @change="onFotoSeleccionada">
        </div>

        <div class="col-12">
            <label for="descripcion" class="form-label">Descripción <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-box"></i></span>
                <textarea id="descripcion" v-model="descripcion" class="form-control" rows="2" maxlength="100" placeholder="Descripción del paquete" enterkeyhint="next" required></textarea>
            </div>
        </div>

        <div class="col-12 col-md-6">
            <label for="importe" class="form-label">Importe total <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                <input type="number" id="importe" v-model="importe" class="form-control" inputmode="decimal" step="0.01" min="0" placeholder="Ej: 125.50" enterkeyhint="next" required>
            </div>
        </div>

        <div class="col-12 col-md-6">
            <label for="importeCrini" class="form-label">Importe pagar furgón <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                <input type="number" id="importeCrini" v-model="importeCrini" class="form-control" inputmode="decimal" step="0.01" min="0" placeholder="Ej: 100.00" enterkeyhint="done" required>
            </div>
        </div>

        <div class="col-12">
            <label for="fecha" class="form-label">Fecha <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-calendar-day"></i></span>
                <input type="date" id="fecha" v-model="fecha" class="form-control" required>
            </div>
        </div>

        <!-- Pagado -->
        <div class="col-12 mt-2">
            <div class="form-check form-switch fs-5">
                <input class="form-check-input" type="checkbox" role="switch" id="pagado" v-model="yaPagado" @change="onCambioPagado">
                <label class="form-check-label" for="pagado">Ya está pagado</label>
            </div>
        </div>

        <template v-if="yaPagado">
            <div class="col-12 col-md-6">
                <label for="importePagado" class="form-label">Importe pagado <span class="text-danger">*</span></label>
                <div class="input-group input-group-lg">
                    <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                    <input type="number" id="importePagado" v-model="importePagado" class="form-control" inputmode="decimal" step="0.01" min="0" placeholder="Ej: 125.50" required>
                </div>
            </div>

            <div class="col-12 col-md-6">
                <label for="fechaPagado" class="form-label">Fecha de pago <span class="text-danger">*</span></label>
                <div class="input-group input-group-lg">
                    <span class="input-group-text"><i class="fa-solid fa-calendar-day"></i></span>
                    <input type="date" id="fechaPagado" v-model="fechaPagado" class="form-control" required>
                </div>
            </div>
        </template>

    </div>

    <!-- Botón, fijo abajo para no tener que buscarlo con scroll en móvil -->
    <div class="submit-bar mt-4 py-3">
        <button type="submit" class="btn btn-primary btn-lg w-100">
            <i class="fa-solid fa-floppy-disk"></i> Guardar
        </button>
    </div>
</form>


                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { show_alerta, enviarSolicitud } from '../funciones';
import { comprimirImagen, subirFotosCaja } from '../utilFoto';
import { buscarSugerenciasRemitente, buscarSugerenciasDestinatario } from '../utilSugerencias';

export default{
    data(){
        return{
            codigoCaja:'',
            remitente: '',
            documentoRemitente: '',
            fecha: new Date().toISOString().split('T')[0],
            telefonoRemitente: '',
            destinatario: '',
            direccion: '',
            telefonoDestinatario: '',
            descripcion: '',
            importe:'',
            importeCrini:'',
            yaPagado: false,
            fechaPagado: '',
            importePagado: '',
            fotos: [],
            sugerenciasRemitente: [],
            sugerenciasDestinatario: [],
            url: `${process.env.VUE_APP_API_URL}/crearCaja/`
        }
    },
    beforeUnmount(){
        this.fotos.forEach(f => URL.revokeObjectURL(f.previewUrl));
    },
    methods: {
        buscarRemitenteDebounced(){
            clearTimeout(this._timerRemitente);
            this._timerRemitente = setTimeout(async () => {
                const q = this.remitente.trim();
                if (q.length < 2) { this.sugerenciasRemitente = []; return; }
                try {
                    this.sugerenciasRemitente = await buscarSugerenciasRemitente(q);
                } catch (error) {
                    console.error('Error al buscar sugerencias de remitente:', error);
                }
            }, 300);
        },
        seleccionarRemitente(s){
            this.remitente = s.remitente;
            this.documentoRemitente = s.documentoRemitente || this.documentoRemitente;
            this.telefonoRemitente = s.telefonoRemitente || this.telefonoRemitente;
            this.sugerenciasRemitente = [];
        },
        buscarDestinatarioDebounced(){
            clearTimeout(this._timerDestinatario);
            this._timerDestinatario = setTimeout(async () => {
                const q = this.destinatario.trim();
                if (q.length < 2) { this.sugerenciasDestinatario = []; return; }
                try {
                    this.sugerenciasDestinatario = await buscarSugerenciasDestinatario(q);
                } catch (error) {
                    console.error('Error al buscar sugerencias de destinatario:', error);
                }
            }, 300);
        },
        seleccionarDestinatario(s){
            this.destinatario = s.destinatario;
            this.telefonoDestinatario = s.telefonoDestinatario || this.telefonoDestinatario;
            this.direccion = s.direccion || this.direccion;
            this.sugerenciasDestinatario = [];
        },
        ocultarSugerenciasConDelay(campo){
            // delay para que el mousedown de la sugerencia (si el usuario esta tocando una) alcance a dispararse antes
            setTimeout(() => {
                if (campo === 'remitente') this.sugerenciasRemitente = [];
                else this.sugerenciasDestinatario = [];
            }, 200);
        },
        onCambioPagado(){
            if(this.yaPagado){
                this.fechaPagado = this.fechaPagado || new Date().toISOString().split('T')[0];
                this.importePagado = this.importePagado || this.importe;
            }
        },
        async onFotoSeleccionada(event){
            const archivos = Array.from(event.target.files || []);
            event.target.value = '';
            for (const archivo of archivos) {
                try{
                    const blob = await comprimirImagen(archivo);
                    this.fotos.push({ blob, previewUrl: URL.createObjectURL(blob) });
                }catch(error){
                    show_alerta('No se pudo procesar una de las fotos', 'error');
                }
            }
        },
        quitarFoto(indice){
            URL.revokeObjectURL(this.fotos[indice].previewUrl);
            this.fotos.splice(indice, 1);
        },
        guardar(event){
            event.preventDefault();
            const form = event.target;
            if(!form.checkValidity()){
                form.reportValidity();
                return;
            }

            var parametros = {
                codigoCaja:this.codigoCaja,
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
                importePagado: this.yaPagado ? this.importePagado : 0
            }
            const subirFoto = this.fotos.length
                ? (creada) => subirFotosCaja(creada.id, this.fotos.map(f => f.blob))
                : null;
            enviarSolicitud('POST',parametros,this.url,'Caja guardada',subirFoto)
        }
    }
}

</script>

<style scoped>
.sugerencias-lista {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 30;
    max-height: 240px;
    overflow-y: auto;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
    border-radius: 0 0 8px 8px;
}

.fotos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
}
.foto-miniatura {
    position: relative;
    aspect-ratio: 1;
}
.foto-miniatura img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid var(--bs-border-color);
}
.foto-quitar {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--bs-danger);
    color: #fff;
    border: none;
    font-size: 12px;
    line-height: 1;
}

.submit-bar {
    position: sticky;
    bottom: 0;
    background: #fff;
    border-top: 1px solid var(--bs-border-color);
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
}
</style>
