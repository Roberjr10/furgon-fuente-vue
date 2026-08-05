<template>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-header bg-primary bg-opacity-50 text-white text-center"><h4>Crear Caja</h4></div>
                <div class="card-body pb-0">


<form @submit="guardar" novalidate class="container py-3">
    <div class="row g-3">

        <div class="col-12">
            <label for="codigoCaja" class="form-label">Código de la caja</label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-barcode"></i></span>
                <input ref="primerCampo" type="text" id="codigoCaja" v-model="codigoCaja" class="form-control" maxlength="50" placeholder="Ej: 181-" autofocus enterkeyhint="next" required>
            </div>
        </div>

        <!-- Sección REMITENTE -->
        <div class="col-12 mt-4">
            <h5 class="section-title">Datos del Remitente</h5>
        </div>

        <div class="col-12">
            <label for="remitente" class="form-label">Remitente</label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                <input type="text" id="remitente" v-model="remitente" class="form-control" maxlength="50" placeholder="Nombre del remitente" enterkeyhint="next" required>
            </div>
        </div>

        <div class="col-12">
            <label for="telefonoRemitente" class="form-label">Teléfono remitente</label>
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
            <label for="destinatario" class="form-label">Destinatario</label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                <input type="text" id="destinatario" v-model="destinatario" class="form-control" maxlength="50" placeholder="Nombre del destinatario" enterkeyhint="next" required>
            </div>
        </div>

        <div class="col-12">
            <label for="telefonoDestinatario" class="form-label">Teléfono destinatario</label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                <input type="tel" id="telefonoDestinatario" v-model="telefonoDestinatario" class="form-control" inputmode="tel" maxlength="15" placeholder="Ej: 600 987 654" enterkeyhint="next" required>
            </div>
        </div>

        <div class="col-12">
            <label for="direccion" class="form-label">Dirección</label>
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
            <label for="descripcion" class="form-label">Descripción</label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-box"></i></span>
                <textarea id="descripcion" v-model="descripcion" class="form-control" rows="2" maxlength="100" placeholder="Descripción del paquete" enterkeyhint="next" required></textarea>
            </div>
        </div>

        <div class="col-12 col-md-6">
            <label for="importe" class="form-label">Importe total</label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                <input type="number" id="importe" v-model="importe" class="form-control" inputmode="decimal" step="0.01" min="0" placeholder="Ej: 125.50" enterkeyhint="next" required>
            </div>
        </div>

        <div class="col-12 col-md-6">
            <label for="importeCrini" class="form-label">Importe pagar furgón</label>
            <div class="input-group input-group-lg">
                <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                <input type="number" id="importeCrini" v-model="importeCrini" class="form-control" inputmode="decimal" step="0.01" min="0" placeholder="Ej: 100.00" enterkeyhint="done" required>
            </div>
        </div>

        <div class="col-12">
            <label for="fecha" class="form-label">Fecha</label>
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
                <label for="importePagado" class="form-label">Importe pagado</label>
                <div class="input-group input-group-lg">
                    <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                    <input type="number" id="importePagado" v-model="importePagado" class="form-control" inputmode="decimal" step="0.01" min="0" placeholder="Ej: 125.50" required>
                </div>
            </div>

            <div class="col-12 col-md-6">
                <label for="fechaPagado" class="form-label">Fecha de pago</label>
                <div class="input-group input-group-lg">
                    <span class="input-group-text"><i class="fa-solid fa-calendar-day"></i></span>
                    <input type="date" id="fechaPagado" v-model="fechaPagado" class="form-control" required>
                </div>
            </div>
        </template>

    </div>

    <!-- Botón, fijo abajo para no tener que buscarlo con scroll en móvil -->
    <div class="submit-bar mt-4 py-3">
        <button type="submit" class="btn btn-success btn-lg w-100">
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
import { enviarSolicitud } from '../funciones';

export default{
    data(){
        return{
            codigoCaja:'',
            remitente: '',
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
            url: `${process.env.VUE_APP_API_URL}/crearCaja/`
        }
    },
    methods: {
        onCambioPagado(){
            if(this.yaPagado){
                this.fechaPagado = this.fechaPagado || new Date().toISOString().split('T')[0];
                this.importePagado = this.importePagado || this.importe;
            }
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
            enviarSolicitud('POST',parametros,this.url,'Caja guardada')
        }
    }
}

</script>

<style scoped>
.section-title {
    color: #fdfdfd;
    border-bottom: 3px solid #3c9eee;
    background-color: #0e0586;
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: bold;
}

.submit-bar {
    position: sticky;
    bottom: 0;
    background: #fff;
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
}
</style>
