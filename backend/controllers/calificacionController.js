const pool = require('../config/db');

async function registrarCalificacion(req, res) {
  const { estudiante_id, curso_id, nota } = req.body;
  const docenteId = req.usuario.id;

  if (!estudiante_id || !curso_id || nota === undefined) {
    return res.status(400).json({ error: 'Estudiante, curso y nota son obligatorios.' });
  }

  try {
    const curso = await pool.query(
      'SELECT id FROM cursos WHERE id = $1 AND docente_id = $2',
      [curso_id, docenteId]
    );
    if (curso.rows.length === 0) {
      return res.status(403).json({ error: 'Ese curso no pertenece al docente autenticado.' });
    }

    const resultado = await pool.query(
      'INSERT INTO calificaciones (estudiante_id, curso_id, nota) VALUES ($1, $2, $3) RETURNING *',
      [estudiante_id, curso_id, nota]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al registrar la calificación.' });
  }
}

async function listarPorCurso(req, res) {
  const { id } = req.params;
  try {
    const resultado = await pool.query(`
      SELECT cal.id, u.nombre AS estudiante, cal.nota, cal.fecha_registro
      FROM calificaciones cal
      JOIN usuarios u ON u.id = cal.estudiante_id
      WHERE cal.curso_id = $1
      ORDER BY cal.fecha_registro DESC
    `, [id]);
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al consultar las calificaciones.' });
  }
}

module.exports = { registrarCalificacion, listarPorCurso };