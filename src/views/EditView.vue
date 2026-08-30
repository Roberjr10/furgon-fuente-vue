<template>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-header bg-primary bg-opacity-50 text-white text-center"><h4>Editar Caja</h4></div>
                <div class="card-body pb-0">


<form @submit="guardar" novalidate class="container py-3">
    <div class="row g-3">

        <div class="col-12">
            <label for="codigoCaja" class="form-label">Código de la caja <span class="text-muted fw-normal">(opcional)</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-barcode"></i></span>
                <input type="text" id="codigoCaja" v-model="codigoCaja" class="form-control" maxlength="50" placeholder="Déjalo en blanco si aún no lo tienes" enterkeyhint="next">
            </div>
        </div>

        <!-- Sección REMITENTE -->
        <div class="col-12 mt-4">
            <h5 class="section-title">Datos del Remitente</h5>
        </div>

        <div class="col-12">
            <label for="remitente" class="form-label">Remitente <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                <input type="text" id="remitente" v-model="remitente" class="form-control" maxlength="50" placeholder="Nombre del remitente" enterkeyhint="next" required>
            </div>
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

        <div class="col-12">
            <label for="destinatario" class="form-label">Destinatario <span class="text-danger">*</span></label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                <input type="text" id="destinatario" v-model="destinatario" class="form-control" maxlength="50" placeholder="Nombre del destinatario" enterkeyhint="next" required>
            </div>
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
            <div v-if="cargandoFoto" class="text-center my-2">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span class="text-muted ms-2">Cargando fotos...</span>
            </div>
            <div v-if="fotosExistentes.length || fotosNuevas.length" class="fotos-grid mb-2">
                <div v-for="foto in fotosExistentes" :key="'g-' + foto.id" class="foto-miniatura">
                    <img :src="foto.url" alt="Foto del paquete">
                    <button type="button" class="foto-quitar" title="Quitar" @click="quitarFotoExistente(foto.id)">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div v-for="(foto, i) in fotosNuevas" :key="'n-' + i" class="foto-miniatura">
                    <img :src="foto.previewUrl" alt="Foto del paquete">
                    <button type="button" class="foto-quitar" title="Quitar" @click="quitarFotoNueva(i)">
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
import { comprimirImagen, subirFotosCaja, listarFotosCaja, obtenerUrlFoto, borrarFoto } from '../utilFoto';
import { useRoute } from 'vue-router';
import axios from 'axios';


export default{
    data(){
        return{
            id: null,
            codigoCaja:'',
            remitente: '',
            documentoRemitente: '',
            fecha: '',
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
            fotosExistentes: [],
            fotosNuevas: [],
            cargandoFoto: false,
            url:  `${process.env.VUE_APP_API_URL}`

        }
    },
    mounted(){
        const route = useRoute();
        this.id = route.params.id;
        this.urlModificar = this.url+'/modificarCaja/'+this.id
        this.getCaja(this.id);
        this.cargarFotoExistente(this.id);
    },
    beforeUnmount(){
        this.fotosExistentes.forEach(f => URL.revokeObjectURL(f.url));
        this.fotosNuevas.forEach(f => URL.revokeObjectURL(f.previewUrl));
    },
    methods: {
        onCambioPagado(){
            if(this.yaPagado){
                this.fechaPagado = this.fechaPagado || new Date().toISOString().split('T')[0];
                this.importePagado = this.importePagado || this.importe;
            }
        },
        async cargarFotoExistente(id){
            this.cargandoFoto = true;
            try{
                const ids = await listarFotosCaja(id);
                this.fotosExistentes = await Promise.all(
                    ids.map(async fotoId => ({ id: fotoId, url: await obtenerUrlFoto(fotoId) }))
                );
            }catch(error){
                console.error('Error al cargar las fotos:', error);
            }finally{
                this.cargandoFoto = false;
            }
        },
        async quitarFotoExistente(fotoId){
            try{
                await borrarFoto(fotoId);
                const i = this.fotosExistentes.findIndex(f => f.id === fotoId);
                if (i !== -1){
                    URL.revokeObjectURL(this.fotosExistentes[i].url);
                    this.fotosExistentes.splice(i, 1);
                }
            }catch(error){
                show_alerta('No se pudo borrar la foto', 'error');
            }
        },
        quitarFotoNueva(indice){
            URL.revokeObjectURL(this.fotosNuevas[indice].previewUrl);
            this.fotosNuevas.splice(indice, 1);
        },
        async onFotoSeleccionada(event){
            const archivos = Array.from(event.target.files || []);
            event.target.value = '';
            for (const archivo of archivos) {
                try{
                    const blob = await comprimirImagen(archivo);
                    this.fotosNuevas.push({ blob, previewUrl: URL.createObjectURL(blob) });
                }catch(error){
                    show_alerta('No se pudo procesar una de las fotos', 'error');
                }
            }
        },
        getCaja(id){
            axios.get(this.url+'/consultarCaja/'+ id).then(
                response => {
                    this.codigoCaja = response.data['codigoCaja'] || '',
                    this.remitente = response.data['remitente'],
                    this.documentoRemitente = response.data['documentoRemitente'] || '',
                    this.fecha = new Date(response.data['fecha']).toISOString().split('T')[0],
                    this.telefonoRemitente= response.data['telefonoRemitente'],
                    this.destinatario= response.data['destinatario'],
                    this.direccion= response.data['direccion'],
                    this.telefonoDestinatario= response.data['telefonoDestinatario'],
                    this.descripcion= response.data['descripcion'],
                    this.yaPagado= !!Number(response.data['pagado']),
                    this.importe= response.data['importe'],
                    this.importeCrini= response.data['importeCrini'],
                    this.fechaPagado = response.data['fechaPagado'] ? new Date(response.data['fechaPagado']).toISOString().split('T')[0] : '',
                    this.importePagado = response.data['importePagado']


                }

            )
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
            const subirFoto = this.fotosNuevas.length
                ? () => subirFotosCaja(this.id, this.fotosNuevas.map(f => f.blob))
                : null;
            enviarSolicitud('PUT',parametros,this.urlModificar,'Caja actualizada',subirFoto)
        }
    }
}

</script>

<style scoped>
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
