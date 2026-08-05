<template>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-header bg-primary text-white text-center"><h4>EDITAR PRODUCTO</h4></div>
                <div class="card-body">


<form @submit="guardar" novalidate class="container py-3">
    <div class="row g-3">

        <!-- Sección REMITENTE -->
        <div class="col-12">
            <h5 class="section-title">Datos del Remitente</h5>
        </div>

        <div class="col-12 col-md-6">
            <label for="remitente" class="form-label">Remitente</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                <input type="text" id="remitente" v-model="remitente" class="form-control" maxlength="50" placeholder="Nombre del remitente" required>
            </div>
        </div>

        <div class="col-12 col-md-6">
            <label for="documentoRemitente" class="form-label">Documento del remitente <span class="text-muted fw-normal">(opcional)</span></label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-id-card"></i></span>
                <input type="text" id="documentoRemitente" v-model="documentoRemitente" class="form-control" maxlength="50" placeholder="DNI, cédula, pasaporte...">
            </div>
        </div>

        <div class="col-12 col-md-6">
            <label for="fecha" class="form-label">Fecha</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-calendar-day"></i></span>
                <input type="date" id="fecha" v-model="fecha" class="form-control" required>
            </div>
        </div>

        <div class="col-12 col-md-6">
            <label for="telefonoRemitente" class="form-label">Teléfono remitente</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                <input type="tel" id="telefonoRemitente" v-model="telefonoRemitente" class="form-control" maxlength="15" placeholder="Ej: +34 600 123 456" required>
            </div>
        </div>

        <!-- Sección DESTINATARIO -->
        <div class="col-12 mt-4">
            <h5 class="section-title">Datos del Destinatario</h5>
        </div>

        <div class="col-12 col-md-6">
            <label for="destinatario" class="form-label">Destinatario</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                <input type="text" id="destinatario" v-model="destinatario" class="form-control" maxlength="50" placeholder="Nombre del destinatario" required>
            </div>
        </div>

        <div class="col-12">
            <label for="direccion" class="form-label">Dirección</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-location-dot"></i></span>
                <textarea type="text" id="direccion" v-model="direccion" class="form-control" maxlength="100" placeholder="Dirección del destinatario" required></textarea>
            </div>
        </div>

        <div class="col-12 col-md-6">
            <label for="telefonoDestinatario" class="form-label">Teléfono destinatario</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                <input type="tel" id="telefonoDestinatario" v-model="telefonoDestinatario" class="form-control" maxlength="15" placeholder="Ej: +34 600 987 654" required>
            </div>
        </div>

        <!-- Sección PAQUETE -->

        <div class="col-12 mt-4">
            <h5 class="section-title">Detalles del Paquete</h5>
        </div>

        <div class="col-12 col-md-6">
            <label for="codigoCaja" class="form-label">Código de la caja <span class="text-muted fw-normal">(opcional)</span></label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-barcode"></i></span>
                <input type="text" id="codigoCaja" v-model="codigoCaja" class="form-control" maxlength="50" placeholder="Ej: 181-001">
            </div>
        </div>
        <div class="col-12">
            <label for="descripcion" class="form-label">Descripción</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-box"></i></span>
                <textarea type="text" id="descripcion" v-model="descripcion" class="form-control" maxlength="100" placeholder="Descripción del paquete" required></textarea>
            </div>
        </div>

        <div class="col-12">
            <label class="form-label">Foto del paquete</label>
            <div v-if="cargandoFoto" class="text-center my-2">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span class="text-muted ms-2">Cargando foto...</span>
            </div>
            <div v-if="fotoPreviewUrl" class="mb-2 text-center">
                <img :src="fotoPreviewUrl" alt="Foto del paquete" class="foto-preview img-thumbnail">
            </div>
            <button type="button" class="btn btn-outline-primary w-100" @click="$refs.inputFoto.click()">
                <i class="fa-solid fa-camera"></i> {{ fotoPreviewUrl ? 'Cambiar foto' : 'Añadir foto' }}
            </button>
            <input ref="inputFoto" type="file" accept="image/*" capture="environment" class="d-none" @change="onFotoSeleccionada">
        </div>

        <div class="col-12 col-md-6">
            <label for="pagado" class="form-label">Pagado</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-money-bill"></i></span>
                <select id="pagado" class="form-select" v-model="pagado" required>
                    <option value="">Selecciona...</option>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                </select>
            </div>
        </div>

        <div class="col-12 col-md-6">
            <label for="importe" class="form-label">Importe total</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                <input type="number" id="importe" v-model="importe" class="form-control" step="0.01" placeholder="Ej: 125.50" required>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <label for="importePagado" class="form-label">Importe Pagado</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                <input type="number" id="importePagado" v-model="importePagado" class="form-control" step="0.01" placeholder="Ej: 125.50" required>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <label for="importeCrini" class="form-label">Importe pagar furgón</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                <input type="number" id="importeCrini" v-model="importeCrini" class="form-control" step="0.01" placeholder="Ej: 100.00" required>
            </div>
        </div>

        <!-- Botón -->
        <div class="col-12 text-center mt-3">
            <button type="submit" class="btn btn-success w-100 w-md-auto">
                <i class="fa-solid fa-floppy-disk"></i> Guardar
            </button>
        </div>

    </div>
</form>


                </div>
            </div>
        </div>
    </div>

</template>
 <style>
    .foto-preview {
        max-width: 100%;
        max-height: 260px;
        object-fit: contain;
    }
    /* Estilo unificado para todos los títulos de sección */
    .section-title {
        color: #fdfdfd; /* Verde Bootstrap */
        border-bottom: 3px solid #3c9eee;
        background-color: #0e0586; /* Verde muy suave */
        padding: 8px 12px;
        border-radius: 6px;
        font-weight: bold;
    }
</style>
<script>
import { show_alerta, enviarSolicitud } from '../funciones';
import { comprimirImagen, subirFotoCaja, obtenerUrlFotoCaja } from '../utilFoto';
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
            pagado:'',
            importe:'',
            importeCrini:'',
            fechaPagado: '',
            importePagado: '',
            fotoBlob: null,
            fotoPreviewUrl: null,
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
        if (this.fotoPreviewUrl) URL.revokeObjectURL(this.fotoPreviewUrl);
    },
    methods: {
        async cargarFotoExistente(id){
            this.cargandoFoto = true;
            try{
                this.fotoPreviewUrl = await obtenerUrlFotoCaja(id);
            }catch(error){
                console.error('Error al cargar la foto:', error);
            }finally{
                this.cargandoFoto = false;
            }
        },
        async onFotoSeleccionada(event){
            const archivo = event.target.files[0];
            if(!archivo) return;
            try{
                this.fotoBlob = await comprimirImagen(archivo);
                if (this.fotoPreviewUrl) URL.revokeObjectURL(this.fotoPreviewUrl);
                this.fotoPreviewUrl = URL.createObjectURL(this.fotoBlob);
            }catch(error){
                show_alerta('No se pudo procesar la foto', 'error');
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
                    this.pagado= response.data['pagado'],
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
                pagado: this.pagado,
                importe: this.importe,
                importeCrini: this.importeCrini,
                fechaPagado: this.fechaPagado,
                importePagado: this.importePagado
            }
            const subirFoto = this.fotoBlob ? () => subirFotoCaja(this.id, this.fotoBlob) : null;
            enviarSolicitud('PUT',parametros,this.urlModificar,'Producto actualizado',subirFoto)
        }
    }
}

</script>
