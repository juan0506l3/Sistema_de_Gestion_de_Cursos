const express = require('express');
const router = express.Router();
const {
  registrarEstudiante,
  listarEstudiantes,
  misCursos,
  misCalificaciones
} = require('../controllers/estudianteController');
const identificarUsuario = require('../middleware/identificarUsuario');
const verificarRol = require('../middleware/verificarRol');

router.post('/', identificarUsuario, verificarRol(['administrador']), registrarEstudiante);
router.get('/', identificarUsuario, verificarRol(['administrador', 'docente']), listarEstudiantes);
router.get('/mis-cursos', identificarUsuario, verificarRol(['estudiante']), misCursos);
router.get('/mis-calificaciones', identificarUsuario, verificarRol(['estudiante']), misCalificaciones);

module.exports = router;