import { Router } from 'express';
import { crearProducto, listarProductos, actualizarProducto, eliminarProducto } from '../controllers/producto.controller.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// CLIENTE y ADMIN
router.get('/', verificarToken, listarProductos);

// ADMIN
router.post('/', verificarToken, soloAdmin, crearProducto);
router.put('/:id', verificarToken, soloAdmin, actualizarProducto);
router.delete('/:id', verificarToken, soloAdmin, eliminarProducto);

export default router;
