import { pool } from '../config/db.js';

export const crearMembresia = async (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  await pool.query(
    'INSERT INTO membresias(nombre,descripcion,precio) VALUES ($1,$2,$3)',
    [nombre, descripcion, precio]
  );

  res.json({ message: 'Membresía creada' });
};

export const listarMembresias = async (req, res) => {
  const result = await pool.query('SELECT * FROM membresias');
  res.json(result.rows);
};

export const actualizarMembresia = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;

  try {
    await pool.query(
      'UPDATE membresias SET nombre=$1, descripcion=$2, precio=$3 WHERE id=$4',
      [nombre, descripcion, precio, id]
    );
    res.json({ message: 'Membresía actualizada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarMembresia = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM membresias WHERE id=$1', [id]);
    res.json({ message: 'Membresía eliminada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
