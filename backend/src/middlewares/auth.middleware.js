import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: 'Token requerido' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, rol }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso solo para ADMIN' });
  }
  next();
};
