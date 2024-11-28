const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());

// Rutas
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// Cargar certificados
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/serverrecu.duckdns.org/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/serverrecu.duckdns.org/fullchain.pem'),
};

// Servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor HTTPS corriendo en https://localhost:${PORT}`);
});
