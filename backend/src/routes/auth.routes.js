import { Router } from 'express';
import { login, registerAdmin, registerClient, cambiarContrasena } from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();
router.post('/login', login);
router.post('/register-admin', registerAdmin);
router.post('/register-client', registerClient);
router.post('/cambiar-contrasena', verificarToken, cambiarContrasena);

export default router;
