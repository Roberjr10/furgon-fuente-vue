import axios from 'axios';

// Redimensiona y comprime una foto en el propio movil antes de subirla.
// Una foto de camara (3-8MB) queda normalmente en ~100-300KB en JPEG,
// sin perdida perceptible para ver el estado de un paquete.
export function comprimirImagen(archivo, maxDimension = 1280, calidad = 0.75) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onerror = () => reject(new Error('No se pudo leer el archivo'));
        lector.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('El archivo no es una imagen valida'));
            img.onload = () => {
                let { width, height } = img;
                if (width > maxDimension || height > maxDimension) {
                    if (width >= height) {
                        height = Math.round(height * (maxDimension / width));
                        width = maxDimension;
                    } else {
                        width = Math.round(width * (maxDimension / height));
                        height = maxDimension;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo comprimir la imagen'))),
                    'image/jpeg',
                    calidad
                );
            };
            img.src = lector.result;
        };
        lector.readAsDataURL(archivo);
    });
}

// Sube una o varias fotos de una sola vez (todas quedan guardadas, no se
// pisan entre sí como pasaba cuando solo se podía tener una foto por caja).
export function subirFotosCaja(id, blobs) {
    const formData = new FormData();
    blobs.forEach((blob, i) => formData.append('fotos', blob, `foto${i}.jpg`));
    return axios.post(`${process.env.VUE_APP_API_URL}/cajas/${id}/fotos`, formData);
}

// Ids de todas las fotos guardadas de una caja.
export async function listarFotosCaja(id) {
    const respuesta = await axios.get(`${process.env.VUE_APP_API_URL}/cajas/${id}/fotos`);
    return respuesta.data;
}

// Devuelve una URL local (blob:) lista para usar en <img src>.
export async function obtenerUrlFoto(fotoId) {
    const respuesta = await axios.get(`${process.env.VUE_APP_API_URL}/fotos/${fotoId}`, {
        responseType: 'blob'
    });
    return URL.createObjectURL(respuesta.data);
}

export function borrarFoto(fotoId) {
    return axios.delete(`${process.env.VUE_APP_API_URL}/fotos/${fotoId}`);
}

// Espacio total (bytes) y cantidad de todas las fotos subidas.
export async function obtenerAlmacenamientoFotos() {
    const respuesta = await axios.get(`${process.env.VUE_APP_API_URL}/fotos/almacenamiento`);
    return respuesta.data;
}
