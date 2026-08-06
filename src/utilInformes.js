import axios from 'axios';

// tipo: 'completo' (todos los datos, sin firma, para mandar a la empresa antes
// de tener el código) o 'con_codigo' (remitente/destinatario/descripción/código
// + firma, una vez la empresa ya asignó los códigos).
export async function crearInforme(cajaIds, tipo = 'completo') {
    const respuesta = await axios.post(`${process.env.VUE_APP_API_URL}/informes`, { cajaIds, tipo });
    return respuesta.data;
}

export async function listarInformes() {
    const respuesta = await axios.get(`${process.env.VUE_APP_API_URL}/informes`);
    return respuesta.data;
}

// Para cada caja que ya salió en algún informe: en cuál (el más reciente) y cuándo.
export async function obtenerCajasIncluidasEnInformes() {
    const respuesta = await axios.get(`${process.env.VUE_APP_API_URL}/informes/cajas`);
    return respuesta.data;
}

export async function obtenerUrlInformePdf(informeId) {
    const respuesta = await axios.get(`${process.env.VUE_APP_API_URL}/informes/${informeId}/pdf`, {
        responseType: 'blob'
    });
    return URL.createObjectURL(respuesta.data);
}

export function descargarBlobUrl(url, nombreArchivo) {
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}
