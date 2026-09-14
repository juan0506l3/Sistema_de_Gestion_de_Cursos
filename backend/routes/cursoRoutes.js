const express = require('express');
const router = express.Router();
const { crearCurso, listarCursos } = require('../controllers/cursoController');
const verificarRol = require('../middleware/verificarRol');

router.post('/', verificarRol(['administrador']), crearCurso);
router.get('/', verificarRol(['administrador']), listarCursos);

module.exports = router;