const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const users = []; // Base de datos simulada

const SECRET = 'your_jwt_secret'; // Clave para JWT

// Crear usuario
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Datos incompletos');

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send('Usuario registrado');
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Credenciales incorrectas');
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// CRUD: Obtener usuarios
router.get('/', (req, res) => {
  res.json(users);
});

module.exports = router;
