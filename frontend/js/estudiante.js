const usuario = exigirRol(['estudiante']);

document.addEventListener('DOMContentLoaded', () => {
  if (!usuario) return;
  pintarEncabezado(usuario);
  cargarMisCursos();
  cargarMisCalificaciones();
});

async function cargarMisCursos() {
  const tabla = document.getElementById('tabla-mis-cursos');
  try {
    const cursos = await apiFetch('/estudiantes/mis-cursos');
    tabla.innerHTML = '';
    cursos.forEach((curso) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${curso.nombre}</td>
        <td>${curso.docente || 'Sin asignar'}</td>
      `;
      tabla.appendChild(fila);
    });
  } catch (error) {
    console.error(error);
  }
}

async function cargarMisCalificaciones() {
  const tabla = document.getElementById('tabla-mis-calificaciones');
  try {
    const calificaciones = await apiFetch('/estudiantes/mis-calificaciones');
    tabla.innerHTML = '';
    calificaciones.forEach((cal) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${cal.curso}</td>
        <td>${cal.nota}</td>
        <td>${new Date(cal.fecha_registro).toLocaleDateString()}</td>
      `;
      tabla.appendChild(fila);
    });
  } catch (error) {
    console.error(error);
  }
}