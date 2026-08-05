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

export function confirmar(id, etiqueta){

var url = `${process.env.VUE_APP_API_URL}/borrarCaja/${id}`;


    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {confirmButton: 'btn btn-success m-3', cancelButton: 'btn btn-danger'
        } ,buttonsStyling:false
    })

    swalWithBootstrapButtons.fire({
        title: 'Seguro que quieres eliminar la caja ' + (etiqueta || ''),
        text: 'Se perderá la información de la caja',
        icon: 'question' ,
        showCancelButton: true,
        confirmButtonText:'<i class="fa-solid fa-check"></i> Si, eliminar',
        cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar'
    }).then((result)=> {
        if(result.isConfirmed){
                enviarSolicitud('DELETE',{},url,'Caja eliminada');
        }else{
            show_alerta('Operación cancelada','info');
        }
    })
}

// alExito (opcional): callback ejecutado tras una respuesta exitosa, antes del
// mensaje/redirección. Recibe el cuerpo de la respuesta (p.ej. {id: ...} al crear).
export async function enviarSolicitud(metodo,parametros,url,mensaje,alExito) {
    try {
        const respuesta = await axios({ method: metodo, url: url, data: parametros });
        if (alExito) {
            try {
                await alExito(respuesta.data);
            } catch (error) {
                console.error(error);
                show_alerta('Se guardó, pero la foto no se pudo subir', 'warning');
                window.setTimeout(function(){
                    window.location.href='/';
                }, 1500)
                return;
            }
        }
        show_alerta(mensaje, 'success');
        window.setTimeout(function(){
            window.location.href='/';
        }, 1000)
    } catch (error) {
        const mensajeError = (error.response && error.response.data && error.response.data.error) || 'Error en la solicitud';
        show_alerta(mensajeError, 'error');
    }
}
