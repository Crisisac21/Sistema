import { pool } from '../config/db.js';

export const crearHorario = async (req, res) => {
  const { dia, hora_inicio, hora_fin, cupo } = req.body;

  await pool.query(
    'INSERT INTO horarios(dia,hora_inicio,hora_fin,cupo) VALUES ($1,$2,$3,$4)',
    [dia, hora_inicio, hora_fin, cupo]
  );

  res.json({ message: 'Horario creado' });
};

export const listarHorarios = async (req, res) => {
  const result = await pool.query('SELECT * FROM horarios');
  res.json(result.rows);
};

export const asignarHorario = async (req, res) => {
  const { usuario_id, horario_id } = req.body;

  await pool.query(
    'INSERT INTO usuario_horario(usuario_id,horario_id) VALUES ($1,$2)',
    [usuario_id, horario_id]
  );

  res.json({ message: 'Horario asignado al usuario' });
};

export const crearReserva = async (req, res) => {
  const { usuario_id, dia, horaInicio, horaFin } = req.body;

  try {
    // Normalize dia: if it's a weekday name in Spanish, convert to next date occurrence (YYYY-MM-DD)
    const weekdayMap = {
      'lunes': 1,
      'martes': 2,
      'miércoles': 3,
      'miercoles': 3,
      'jueves': 4,
      'viernes': 5,
      'sábado': 6,
      'sabado': 6,
      'domingo': 0
    };

    let diaISO = dia;
    if (typeof dia === 'string') {
      const dLow = dia.trim().toLowerCase();
      if (weekdayMap.hasOwnProperty(dLow)) {
        // compute next date for that weekday
        const target = weekdayMap[dLow];
        const today = new Date();
        const todayDow = today.getDay();
        let daysAhead = target - todayDow;
        if (daysAhead <= 0) daysAhead += 7;
        const next = new Date(today);
        next.setDate(today.getDate() + daysAhead);
        diaISO = next.toISOString().split('T')[0];
      }
    }

    // Check if usuario_horario has the reservation columns
    const colCheck = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='usuario_horario' AND column_name IN ('dia','hora_inicio','hora_fin')"
    );

    if (colCheck.rowCount === 3) {
      // Table supports custom reservations
      // Normalize horaInicio/horaFin to time strings if provided as numbers
      const formatHora = (h) => {
        if (h == null) return null;
        if (typeof h === 'number') return `${String(h).padStart(2,'0')}:00`;
        if (/^\d{1,2}$/.test(String(h))) return `${String(h).padStart(2,'0')}:00`;
        return String(h);
      };
      const horaIniVal = formatHora(horaInicio);
      const horaFinVal = formatHora(horaFin);

      await pool.query(
        'INSERT INTO usuario_horario(usuario_id, dia, hora_inicio, hora_fin) VALUES ($1,$2,$3,$4)',
        [usuario_id, diaISO, horaIniVal, horaFinVal]
      );
      return res.json({ message: 'Reserva creada' });
    }

    // Fallback: create a horarios entry and link it
    const formatHora = (h) => {
      if (h == null) return null;
      if (typeof h === 'number') return `${String(h).padStart(2,'0')}:00`;
      if (/^\d{1,2}$/.test(String(h))) return `${String(h).padStart(2,'0')}:00`;
      return String(h);
    };
    const horaIniVal = formatHora(horaInicio);
    const horaFinVal = formatHora(horaFin);

    const insertHorario = await pool.query(
      'INSERT INTO horarios(dia,hora_inicio,hora_fin,cupo) VALUES ($1,$2,$3,$4) RETURNING id',
      [diaISO, horaIniVal, horaFinVal, 1]
    );
    const horarioId = insertHorario.rows[0].id;
    await pool.query(
      'INSERT INTO usuario_horario(usuario_id, horario_id) VALUES ($1,$2)',
      [usuario_id, horarioId]
    );
    res.json({ message: 'Reserva creada (vinculada a horarios)' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarReservas = async (req, res) => {
  try {
    // If usuario_horario has dia/hora columns, return custom reservations
    const colCheck = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='usuario_horario' AND column_name IN ('dia','hora_inicio','hora_fin')"
    );

    if (colCheck.rowCount === 3) {
      const result = await pool.query(
        'SELECT uh.*, u.nombre as nombre_cliente FROM usuario_horario uh JOIN usuarios u ON uh.usuario_id = u.id WHERE uh.dia IS NOT NULL ORDER BY uh.dia, uh.hora_inicio'
      );
      return res.json(result.rows);
    }

    // Fallback: list reservations that reference a horarios row
    const result = await pool.query(
      'SELECT uh.*, h.dia, h.hora_inicio, h.hora_fin, u.nombre as nombre_cliente FROM usuario_horario uh JOIN horarios h ON uh.horario_id = h.id JOIN usuarios u ON uh.usuario_id = u.id ORDER BY h.dia, h.hora_inicio'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarHorario = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM horarios WHERE id=$1', [id]);
    res.json({ message: 'Horario eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editarHorario = async (req, res) => {
  const { id } = req.params;
  const { dia, hora_inicio, hora_fin, instructor, cupo } = req.body;
  try {
    await pool.query(
      'UPDATE horarios SET dia=$1, hora_inicio=$2, hora_fin=$3, instructor=$4, cupo=$5 WHERE id=$6',
      [dia, hora_inicio, hora_fin, instructor, cupo, id]
    );
    res.json({ message: 'Horario actualizado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
