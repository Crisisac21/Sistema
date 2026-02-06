import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email=$1',
    [email]
  );

  if (result.rowCount === 0)
    return res.status(401).json({ message: 'Usuario no existe' });

  const usuario = result.rows[0];
  // Allow either hashed password (bcrypt) or plain-text match (legacy/testing)
  let valid = false;
  try {
    valid = bcrypt.compareSync(password, usuario.password);
  } catch (e) {
    valid = false;
  }
  // fallback: direct equality (password stored in plaintext)
  if (!valid && usuario.password === password) {
    valid = true;
  }

  if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, usuario });
};

export const registerAdmin = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son obligatorios' });
  }

  // check exists
  const exists = await pool.query('SELECT id FROM usuarios WHERE email=$1', [email]);
  if (exists.rowCount > 0) {
    return res.status(400).json({ message: 'Usuario ya existe' });
  }

  // NOTE: This endpoint stores the password as provided (NO HASH).
  // This is insecure and should be used only for testing as requested.
  await pool.query(
    'INSERT INTO usuarios(nombre,email,password,rol) VALUES ($1,$2,$3,$4)',
    [nombre || 'Admin', email, password, 'ADMIN']
  );

  res.json({ message: 'Admin creado (password guardado en texto plano)' });
};

export const registerClient = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son obligatorios' });
  }

  const exists = await pool.query('SELECT id FROM usuarios WHERE email=$1', [email]);
  if (exists.rowCount > 0) {
    return res.status(400).json({ message: 'Usuario ya existe' });
  }

  // NOTE: store password as provided (plaintext) for testing per user request
  await pool.query(
    'INSERT INTO usuarios(nombre,email,password,rol) VALUES ($1,$2,$3,$4)',
    [nombre || 'Cliente', email, password, 'CLIENTE']
  );

  res.json({ message: 'Cliente creado (password guardado en texto plano)' });
};

export const cambiarContrasena = async (req, res) => {
  const { passwordActual, passwordNueva } = req.body;
  const usuarioId = req.usuario?.id;

  if (!usuarioId) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  if (!passwordActual || !passwordNueva) {
    return res.status(400).json({ message: 'Contraseña actual y nueva son obligatorias' });
  }

  if (passwordNueva.length < 4) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 4 caracteres' });
  }

  try {
    // Get current password from database
    const result = await pool.query(
      'SELECT password FROM usuarios WHERE id=$1',
      [usuarioId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    
    // Verify current password (support both plaintext and bcrypt)
    let passwordValida = false;
    try {
      passwordValida = bcrypt.compareSync(passwordActual, usuario.password);
    } catch (e) {
      passwordValida = false;
    }
    
    if (!passwordValida && usuario.password === passwordActual) {
      passwordValida = true;
    }

    if (!passwordValida) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }

    // Update password (storing plaintext as per testing requirement)
    await pool.query(
      'UPDATE usuarios SET password=$1 WHERE id=$2',
      [passwordNueva, usuarioId]
    );

    res.json({ message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
