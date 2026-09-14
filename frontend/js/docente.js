const usuario = exigirRol(['docente']);

document.addEventListener('DOMContentLoaded', () => {
  if (!usuario) return;
  pintarEncabezado(usuario);
  cargarMisCursos();
});

const listaCursos = document.getElementById('lista-cursos');
const selectCurso = document.getElementById('select-curso-calificacion');
const selectEstudiante = document.getElementById('select-estudiante-calificacion');
const formCalificacion = document.getElementById('form-calificacion');
const mensajeCalificacion = document.getElementById('mensaje-calificacion');
const tablaCalificaciones = document.getElementById('tabla-calificaciones');

async function cargarMisCursos() {
  try {
    const cursos = await apiFetch('/cursos/mios');
    listaCursos.innerHTML = '';
    selectCurso.innerHTML = '<option value="">Seleccione un curso</option>';

    cursos.forEach((curso) => {
      const item = document.createElement('li');
      item.textContent = curso.nombre;
      listaCursos.appendChild(item);

      const opcion = document.createElement('option');
      opcion.value = curso.id;
      opcion.textContent = curso.nombre;
      selectCurso.appendChild(opcion);
    });
  } catch (error) {
    console.error(error);
  }
}

selectCurso.addEventListener('change', async () => {
  const cursoId = selectCurso.value;
  selectEstudiante.innerHTML = '<option value="">Seleccione un estudiante</option>';
  tablaCalificaciones.innerHTML = '';

  if (!cursoId) return;

  try {
    const estudiantes = await apiFetch(`/cursos/${cursoId}/estudiantes`);
    estudiantes.forEach((est) => {
      const opcion = document.createElement('option');
      opcion.value = est.id;
      opcion.textContent = est.nombre;
      selectEstudiante.appendChild(opcion);
    });

    const calificaciones = await apiFetch(`/calificaciones/curso/${cursoId}`);
    calificaciones.forEach((cal) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${cal.estudiante}</td>
        <td>${cal.nota}</td>
        <td>${new Date(cal.fecha_registro).toLocaleDateString()}</td>
      `;
      tablaCalificaciones.appendChild(fila);
    });
  } catch (error) {
    console.error(error);
  }
});

formCalificacion.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mensajeCalificacion.textContent = '';

  const curso_id = selectCurso.value;
  const estudiante_id = selectEstudiante.value;
  const nota = document.getElementById('nota').value;

  if (!curso_id || !estudiante_id || !nota) {
    mensajeCalificacion.textContent = 'Complete curso, estudiante y nota.';
    mensajeCalificacion.className = 'mensaje-error';
    return;
  }

  try {
    await apiFetch('/calificaciones', {
      method: 'POST',
      body: JSON.stringify({ curso_id, estudiante_id, nota })
    });
    document.getElementById('nota').value = '';
    mensajeCalificacion.textContent = 'Calificación registrada correctamente.';
    mensajeCalificacion.className = 'mensaje-exito';
    selectCurso.dispatchEvent(new Event('change'));
  } catch (error) {
    mensajeCalificacion.textContent = error.message;
    mensajeCalificacion.className = 'mensaje-error';
  }
});