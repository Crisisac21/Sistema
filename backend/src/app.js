import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import productosRoutes from './routes/productos.routes.js';
import membresiasRoutes from './routes/membresias.routes.js';
import horariosRoutes from './routes/horarios.routes.js';
import pagosRoutes from './routes/pagos.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Development-friendly Content Security Policy to allow local devtools and frontend
app.use((req, res, next) => {
	// Allow scripts/styles from self and the Angular dev server, and allow XHR/fetch to localhost:3000
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self' 'unsafe-inline' http://localhost:4200 http://localhost:3000 data:; connect-src *;"
	);
	next();
});

// simple root route to avoid 404 at /
app.get('/', (req, res) => {
	res.json({ message: 'Backend API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/membresias', membresiasRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/pagos', pagosRoutes);

export default app;
