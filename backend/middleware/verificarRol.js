function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
      const rol = req.headers['x-usuario-rol'];
  
      if (!rol) {
        return res.status(401).json({ error: 'No se identificó el usuario. Inicie sesión.' });
      }
      if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({ error: 'No tiene permisos para realizar esta acción.' });
      }
      next();
    };
  }
  
  module.exports = verificarRol;