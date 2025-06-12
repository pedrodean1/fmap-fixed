const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// RUTA ABSOLUTA para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Redirige cualquier otra ruta a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
