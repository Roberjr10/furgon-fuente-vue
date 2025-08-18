<template>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-header bg-primary bg-opacity-50 text-white text-center"><h4>Crear Caja</h4></div>
                <div class="card-body">


<form v-on:submit="guardar" class="container py-3">
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
                <input type="text" id="direccion" v-model="direccion" class="form-control" maxlength="100" placeholder="Dirección del destinatario" required>
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
            <label for="codigoCaja" class="form-label">Código de la caja</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-barcode"></i></span>
                <input type="text" id="codigoCaja" v-model="codigoCaja" class="form-control" maxlength="50" placeholder="Ej: 181-" required>
            </div>
        </div> 

        <div class="col-12">
            <label for="descripcion" class="form-label">Descripción</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-box"></i></span>
                <input type="text" id="descripcion" v-model="descripcion" class="form-control" maxlength="100" placeholder="Descripción del paquete" required>
            </div>
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
            <label for="importe" class="form-label">Importe Pagado</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                <input type="number" id="importe" v-model="importePagado" class="form-control" step="0.01" placeholder="Ej: 125.50">
            </div>
        </div>

        <div class="col-12 col-md-6">
            <label for="importeCrini" class="form-label">Importe pagar furgón</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                <input type="number" id="importeCrini" v-model="importeCrini" class="form-control" step="0.01" placeholder="Ej: 100.00" required>
            </div>
        </div>

        
        <div class="col-12 col-md-6">
            <label for="fecha" class="form-label">Fecha de Pago</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-calendar-day"></i></span>
                <input type="date" id="fecha" v-model="fechaPagado" class="form-control">
            </div>
        </div>


        <div class="col-12 col-md-6">
            <label for="codigoComprobante" class="form-label">Código comprobante</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-receipt"></i></span>
                <input type="text" id="codigoComprobante" v-model="codigoComprobante" class="form-control" maxlength="50" placeholder="Código del comprobante" required>
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

<script>
import { show_alerta, enviarSolicitud } from '../funciones';

export default{
    data(){
        return{
            codigoCaja:'',
            remitente: '',
            fecha: '',
            telefonoRemitente: '',
            destinatario: '',
            direccion: '',
            telefonoDestinatario: '',
            descripcion: '',
            pagado:'',
            importe:'',
            importeCrini:'',
            codigoComprobante: '',
            fechaPagado: '',
            importePagado: '',
            url: `${process.env.VUE_APP_API_URL}/crearCaja/`

        }
    },
    methods: {
        guardar(){
            event.preventDefault();
            if(this.codigoCaja.trim() === ''){
                show_alerta('Escribe el codigo de la caja', 'warning', 'codigoCaja')
            }
            else if(this.remitente.trim() === ''){
                show_alerta('Escribe el nombre del remitente', 'warning', 'remitente')
            }
            else if(this.fecha.trim() === ''){
                show_alerta('Escribe la fecha', 'warning', 'fecha')
            }
            else if(this.telefonoRemitente.trim() === ''){
                show_alerta('Escribe telefono Remitente', 'warning', 'telefonoRemitente')
            }
            else if(this.destinatario.trim() === ''){
                show_alerta('Escribe el destinatario', 'warning', 'destinatario')
            }
            else if(this.direccion.trim() === ''){
                show_alerta('Escribe la direccion', 'warning', 'direccion')
            }
            else if(this.telefonoDestinatario.trim() === ''){
                show_alerta('Escribe el telefono Destinatario', 'warning', 'telefonoDestinatario')
            }
            else if(this.descripcion.trim() === ''){
                show_alerta('Escribe la descripcion', 'warning', 'descripcion')
            }
            else  if(this.pagado.trim() === ''){
                show_alerta('Selecciona si ha pagado', 'warning', 'pagado')
            }
            else if(this.importe === ''){
                show_alerta('Escribe el importe', 'warning', 'importe')
            }
            else if(this.importeCrini === ''){
                show_alerta('Escribe el importe Crini', 'warning', 'importeCrini')
            }
            else if(this.codigoComprobante.trim() === ''){
                show_alerta('Escribe el codigo comprobante', 'warning', 'codigoComprobante')
            }
            else{
                var parametros = {
                    codigoCaja:this.codigoCaja,
                     remitente: this.remitente,
                    fecha: this.fecha,
                    telefonoRemitente: this.telefonoRemitente,
                    destinatario: this.destinatario,
                    direccion: this.direccion,
                    telefonoDestinatario: this.telefonoDestinatario,
                    descripcion: this.descripcion,
                    pagado: this.pagado,
                    importe: this.importe,
                    importeCrini: this.importeCrini,
                    codigoComprobante: this.codigoComprobante,
                    fechaPagado: this.fechaPagado,
                    importePagado: this.importePagado

                }
                enviarSolicitud('POST',parametros,this.url,'Producto Guardado')
            }
        }
    }
}

</script>