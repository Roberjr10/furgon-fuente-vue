const express = require('express');
const path = require('path');
const app = express();

// Sirve archivos estáticos desde dist
app.use(express.static(path.join(__dirname, 'dist')));

// Redirige todas las rutas al index.html (para Vue Router history mode)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
