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

export async function obtenerBlobInformePdf(informeId) {
    const respuesta = await axios.get(`${process.env.VUE_APP_API_URL}/informes/${informeId}/pdf`, {
        responseType: 'blob'
    });
    return respuesta.data;
}

export async function borrarInforme(informeId) {
    await axios.delete(`${process.env.VUE_APP_API_URL}/informes/${informeId}`);
}

// window.open en vez de <a download>: en Safari/Chrome móvil el download
// attribute sobre un blob no es confiable (falla en silencio, sobre todo
// después de un await). Abrir en pestaña nueva usa el visor de PDF nativo,
// desde donde el usuario puede guardarlo o compartirlo igual.
export function abrirBlob(blob) {
    window.open(URL.createObjectURL(blob), '_blank');
}

// Web Share API con archivos: abre el panel nativo (WhatsApp, mail, etc.)
// directo con el PDF adjunto. Devuelve false si el navegador no lo soporta
// (Safari/Chrome de escritorio, navegadores viejos) para poder hacer fallback.
export async function compartirBlobPdf(blob, nombreArchivo) {
    const archivo = new File([blob], nombreArchivo, { type: 'application/pdf' });
    if (!navigator.canShare || !navigator.canShare({ files: [archivo] })) {
        return false;
    }
    try {
        await navigator.share({ files: [archivo], title: nombreArchivo });
        return true;
    } catch (error) {
        if (error.name === 'AbortError') return true; // el usuario canceló el share, no es un fallo
        throw error;
    }
}
