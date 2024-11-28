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

// Obtener usuarios (excluir contraseñas)
router.get('/', (req, res) => {
  res.json(users.map(({ password, ...user }) => user)); // No incluir contraseñas
});

// Editar usuario
router.put('/:username', async (req, res) => {
  const { username } = req.params;
  const { newUsername, newPassword } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).send('Usuario no encontrado');
  }

  if (newUsername) {
    if (users.some((u) => u.username === newUsername)) {
      return res.status(400).send('El nuevo nombre de usuario ya existe');
    }
    user.username = newUsername;
  }

  if (newPassword) {
    user.password = await bcrypt.hash(newPassword, 10);
  }

  res.status(200).send('Usuario actualizado');
});

// Eliminar usuario
router.delete('/:username', (req, res) => {
  const { username } = req.params;

  const userIndex = users.findIndex((u) => u.username === username);
  if (userIndex === -1) {
    return res.status(404).send('Usuario no encontrado');
  }

  users.splice(userIndex, 1);
  res.status(200).send('Usuario eliminado');
});

module.exports = router;
