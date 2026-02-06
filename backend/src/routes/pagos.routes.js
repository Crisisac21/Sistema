import { Router } from 'express';
import {
  registrarPago,
  listarPagos,
  marcarPagado
} from '../controllers/pago.controller.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// CLIENTE
router.post('/', verificarToken, registrarPago);

// ADMIN
router.get('/', verificarToken, soloAdmin, listarPagos);
router.put('/:id', verificarToken, soloAdmin, marcarPagado);

export default router;
