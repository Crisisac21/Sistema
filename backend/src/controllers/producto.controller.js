import { pool } from '../config/db.js';

export const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;

  await pool.query(
    'INSERT INTO suplementos(nombre,descripcion,precio,stock) VALUES ($1,$2,$3,$4)',
    [nombre, descripcion, precio, stock]
  );

  res.json({ message: 'Suplemento creado' });
};

export const listarProductos = async (req, res) => {
  const result = await pool.query('SELECT * FROM suplementos');
  res.json(result.rows);
};

export const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;

  try {
    await pool.query(
      'UPDATE suplementos SET nombre=$1, descripcion=$2, precio=$3, stock=$4 WHERE id=$5',
      [nombre, descripcion, precio, stock, id]
    );
    res.json({ message: 'Suplemento actualizado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM suplementos WHERE id=$1', [id]);
    res.json({ message: 'Suplemento eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
