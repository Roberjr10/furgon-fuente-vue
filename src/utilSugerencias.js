import axios from 'axios';

export async function buscarSugerenciasRemitente(q) {
    const respuesta = await axios.get(`${process.env.VUE_APP_API_URL}/sugerencias/remitente`, { params: { q } });
    return respuesta.data;
}

export async function buscarSugerenciasDestinatario(q) {
    const respuesta = await axios.get(`${process.env.VUE_APP_API_URL}/sugerencias/destinatario`, { params: { q } });
    return respuesta.data;
}
