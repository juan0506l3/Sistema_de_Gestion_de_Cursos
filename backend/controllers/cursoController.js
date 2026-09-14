const pool = require('../config/db');

async function crearCurso(req, res) {
  const { nombre, docente_id } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del curso es obligatorio.' });
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO cursos (nombre, docente_id) VALUES ($1, $2) RETURNING *',
      [nombre, docente_id || null]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al crear el curso.' });
  }
}

async function listarCursos(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT c.id, c.nombre, u.nombre AS docente
      FROM cursos c
      LEFT JOIN usuarios u ON u.id = c.docente_id
      ORDER BY c.id
    `);
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al consultar los cursos.' });
  }
}

module.exports = { crearCurso, listarCursos };