import { Router } from 'express';
import { crearMembresia, listarMembresias, actualizarMembresia, eliminarMembresia } from '../controllers/membresia.controller.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// CLIENTE y ADMIN
router.get('/', verificarToken, listarMembresias);

// ADMIN
router.post('/', verificarToken, soloAdmin, crearMembresia);
router.put('/:id', verificarToken, soloAdmin, actualizarMembresia);
router.delete('/:id', verificarToken, soloAdmin, eliminarMembresia);

export default router;
