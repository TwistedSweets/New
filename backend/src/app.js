require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 3001;

// Seguridad: proteger contra vulnerabilidades comunes.
app.use(helmet());

// Permite solicitudes de React con credenciales (cookies) desde el frontend.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Express deja leer el cuerpo de las solicitudes JSON en mis rutas.
app.use(express.json());

// Middleware para parsear cookies en las solicitudes.
app.use(cookieParser());

// Rutas de autenticación (registro, login, logout).
app.use('/api/auth', authRoutes);

// Chequeo de salud — testear en Postman: GET http://localhost:3001/api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler - si ninguna ruta coincide, responde con un error 404.
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler - captura errores no manejados en las rutas y responde con un error 500.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Inicia el servidor en el puerto especificado.
// Para desarrollo: npm run dev (con nodemon para recarga automática)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
