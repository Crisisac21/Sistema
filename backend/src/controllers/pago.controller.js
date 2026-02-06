import { pool } from '../config/db.js';

export const registrarPago = async (req, res) => {
  let { usuario_id, total, metodo, estado } = req.body;

  // if usuario_id not provided in body, use id from token (verificarToken middleware)
  if (!usuario_id && req.usuario && req.usuario.id) {
    usuario_id = req.usuario.id;
  }

  await pool.query(
    'INSERT INTO pagos(usuario_id,total,metodo,estado) VALUES ($1,$2,$3,$4)',
    [usuario_id, total, metodo, estado]
  );

  res.json({ message: 'Pago registrado', usuario_id });
};

export const listarPagos = async (req, res) => {
  // use LEFT JOIN so pagos without usuario_id or with null user still appear
  const result = await pool.query(
    `SELECT p.*, u.nombre 
     FROM pagos p 
     LEFT JOIN usuarios u ON p.usuario_id = u.id`
  );
  res.json(result.rows);
};

export const marcarPagado = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE pagos SET estado='PAGADO' WHERE id=$1",
    [id]
  );

  res.json({ message: 'Pago marcado como PAGADO' });
};
