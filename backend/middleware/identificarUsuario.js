function identificarUsuario(req, res, next) {
  const id = req.headers['x-usuario-id'];
  const rol = req.headers['x-usuario-rol'];

  if (!id || !rol) {
    return res.status(401).json({ error: 'No se identificó el usuario. Inicie sesión.' });
  }

  req.usuario = { id: Number(id), rol };
  next();
}

module.exports = identificarUsuario;
