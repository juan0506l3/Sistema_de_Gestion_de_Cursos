const express = require('express');
const router = express.Router();
const { registrarCalificacion, listarPorCurso } = require('../controllers/calificacionController');
const identificarUsuario = require('../middleware/identificarUsuario');
const verificarRol = require('../middleware/verificarRol');

router.post('/', identificarUsuario, verificarRol(['docente']), registrarCalificacion);
router.get('/curso/:id', identificarUsuario, verificarRol(['docente', 'administrador']), listarPorCurso);

module.exports = router;