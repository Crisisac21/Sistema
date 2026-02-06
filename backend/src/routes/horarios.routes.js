import { Router } from 'express';
import {
  crearHorario,
  listarHorarios,
  asignarHorario,
  crearReserva,
  listarReservas,
  eliminarHorario,
  editarHorario
} from '../controllers/horario.controller.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// CLIENTE y ADMIN
router.get('/', verificarToken, listarHorarios);

// ADMIN
router.post('/', verificarToken, soloAdmin, crearHorario);
router.get('/reservas', verificarToken, soloAdmin, listarReservas);
router.delete('/:id', verificarToken, soloAdmin, eliminarHorario);
router.put('/:id', verificarToken, soloAdmin, editarHorario);

// CLIENTE
router.post('/asignar', verificarToken, asignarHorario);
router.post('/reserva', verificarToken, crearReserva);

export default router;
