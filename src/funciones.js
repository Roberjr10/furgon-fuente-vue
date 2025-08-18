import Swal from "sweetalert2";
import axios from "axios";

export function show_alerta(mensaje, icono, foco=''){
    if(foco !== ''){
        document.getElementById(foco).focus();
    }
    Swal.fire({
        title:mensaje,
        icon:icono,
        customClass: { confirmButton: 'btn btn-primary', popup: 'animated zoomIn'},
        buttonsStyling: false
    });
}

export function confirmar(codigoCaja){

var url = `${process.env.VUE_APP_API_URL}/borrarCaja/${codigoCaja}`;


    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {confirmButton: 'btn btn-success m-3', cancelButton: 'btn btn-danger'
        } ,buttonsStyling:false
    })

    swalWithBootstrapButtons.fire({
        title: 'Seguro que quieres eliminar la caja ' +codigoCaja,
        text: 'Se perderá la información de la caja',
        icon: 'question' ,
        showCancelButton: true,
        confirmButtonText:'<i class="fa-solid fa-check"></i> Si, eliminar',
        cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar'
    }).then((result)=> {
        if(result.isConfirmed){
                enviarSolicitud('DELETE',{codigoCaja:codigoCaja},url,'Caja eliminada');
        }else{
            show_alerta('Operación cancelada','info');
        }
    })
}

export function enviarSolicitud(metodo,parametros,url,mensaje) {

    axios({
        method:metodo,
        url:url,
        data:parametros
    }).then(function(respuesta){
        var status = respuesta.data;
        if(status === 'success'){
            show_alerta(mensaje,status);
            window.setTimeout(function(){
                window.location.href='/';
            }, 1000)
        }else {
            var listado ='';
            var errores = respuesta.data[1]['errors']
            Object.keys(errores).forEach(
                key => listado += errores[key][0] + '#####'
            );

            show_alerta(listado,'error');
            console.log(listado)
        }
    }).catch(function(error){
        show_alerta('Error en la solicitud', 'error');
    });
}

