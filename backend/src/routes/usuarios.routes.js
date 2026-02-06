import { Router } from 'express';
import { crearUsuario, listarUsuarios, actualizarUsuario, eliminarUsuario } from '../controllers/usuario.controller.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// ADMIN
router.post('/', verificarToken, soloAdmin, crearUsuario);
router.get('/', verificarToken, soloAdmin, listarUsuarios);
router.put('/:id', verificarToken, soloAdmin, actualizarUsuario);
router.delete('/:id', verificarToken, soloAdmin, eliminarUsuario);

export default router;
