const express = require('express');
const router = express.Router();
const { crearCurso, listarCursos, misCursos, estudiantesDeCurso } = require('../controllers/cursoController');
const identificarUsuario = require('../middleware/identificarUsuario');
const verificarRol = require('../middleware/verificarRol');

router.post('/', identificarUsuario, verificarRol(['administrador']), crearCurso);
router.get('/', identificarUsuario, verificarRol(['administrador']), listarCursos);
router.get('/mios', identificarUsuario, verificarRol(['docente']), misCursos);
router.get('/:id/estudiantes', identificarUsuario, verificarRol(['administrador', 'docente']), estudiantesDeCurso);

module.exports = router;