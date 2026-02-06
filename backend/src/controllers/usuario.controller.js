import { pool } from '../config/db.js';

export const crearUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    // Store password as plaintext (as requested for testing)
    await pool.query(
      'INSERT INTO usuarios(nombre,email,password,rol) VALUES ($1,$2,$3,$4)',
      [nombre, email, password, rol]
    );
    res.json({ message: 'Usuario creado (password guardado en texto plano)' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarUsuarios = async (req, res) => {
  const result = await pool.query(
    'SELECT id,nombre,email,rol FROM usuarios'
  );
  res.json(result.rows);
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol } = req.body;

  try {
    if (password) {
      await pool.query(
        'UPDATE usuarios SET nombre=$1, email=$2, password=$3, rol=$4 WHERE id=$5',
        [nombre, email, password, rol, id]
      );
    } else {
      await pool.query(
        'UPDATE usuarios SET nombre=$1, email=$2, rol=$3 WHERE id=$4',
        [nombre, email, rol, id]
      );
    }
    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
