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

export function subirFotoCaja(codigoCaja, blob) {
    const formData = new FormData();
    formData.append('foto', blob, 'foto.jpg');
    return axios.post(`${process.env.VUE_APP_API_URL}/cajas/${codigoCaja}/foto`, formData);
}

// Devuelve una URL local (blob:) lista para usar en <img src>, o null si la caja no tiene foto.
export async function obtenerUrlFotoCaja(codigoCaja) {
    try {
        const respuesta = await axios.get(`${process.env.VUE_APP_API_URL}/cajas/${codigoCaja}/foto`, {
            responseType: 'blob'
        });
        return URL.createObjectURL(respuesta.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
}

export function borrarFotoCaja(codigoCaja) {
    return axios.delete(`${process.env.VUE_APP_API_URL}/cajas/${codigoCaja}/foto`);
}
