const pool = require('../config/db');

async function registrarEstudiante(req, res) {
  const { nombre, correo, password, curso_id } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
  }

  try {
    const resultado = await pool.query(
      "INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, 'estudiante') RETURNING id, nombre, correo, rol",
      [nombre, correo, password]
    );
    const estudiante = resultado.rows[0];

    if (curso_id) {
      await pool.query(
        'INSERT INTO inscripciones (curso_id, estudiante_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [curso_id, estudiante.id]
      );
    }

    res.status(201).json(estudiante);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ese correo ya está registrado.' });
    }
    res.status(500).json({ error: 'Error del servidor al registrar el estudiante.' });
  }
}

async function listarEstudiantes(req, res) {
  try {
    const resultado = await pool.query(
      "SELECT id, nombre, correo FROM usuarios WHERE rol = 'estudiante' ORDER BY nombre"
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al consultar los estudiantes.' });
  }
}

async function misCursos(req, res) {
  const estudianteId = req.usuario.id;
  try {
    const resultado = await pool.query(`
      SELECT c.id, c.nombre, u.nombre AS docente
      FROM inscripciones i
      JOIN cursos c ON c.id = i.curso_id
      LEFT JOIN usuarios u ON u.id = c.docente_id
      WHERE i.estudiante_id = $1
      ORDER BY c.id
    `, [estudianteId]);
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al consultar sus cursos.' });
  }
}

async function misCalificaciones(req, res) {
  const estudianteId = req.usuario.id;
  try {
    const resultado = await pool.query(`
      SELECT c.nombre AS curso, cal.nota, cal.fecha_registro
      FROM calificaciones cal
      JOIN cursos c ON c.id = cal.curso_id
      WHERE cal.estudiante_id = $1
      ORDER BY cal.fecha_registro DESC
    `, [estudianteId]);
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al consultar sus calificaciones.' });
  }
}

module.exports = { registrarEstudiante, listarEstudiantes, misCursos, misCalificaciones };