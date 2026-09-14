const usuario = exigirRol(['administrador']);

document.addEventListener('DOMContentLoaded', () => {
  if (!usuario) return;
  pintarEncabezado(usuario);
  cargarCursos();
  cargarEstudiantes();
});

const formCurso = document.getElementById('form-curso');
const tablaCursos = document.getElementById('tabla-cursos');
const mensajeCurso = document.getElementById('mensaje-curso');

formCurso.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mensajeCurso.textContent = '';

  const nombre = document.getElementById('nombre-curso').value.trim();

  try {
    await apiFetch('/cursos', {
      method: 'POST',
      body: JSON.stringify({ nombre })
    });
    document.getElementById('nombre-curso').value = '';
    mensajeCurso.textContent = 'Curso creado correctamente.';
    mensajeCurso.className = 'mensaje-exito';
    cargarCursos();
  } catch (error) {
    mensajeCurso.textContent = error.message;
    mensajeCurso.className = 'mensaje-error';
  }
});

async function cargarCursos() {
  try {
    const cursos = await apiFetch('/cursos');
    tablaCursos.innerHTML = '';
    cursos.forEach((curso) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${curso.id}</td>
        <td>${curso.nombre}</td>
        <td>${curso.docente || 'Sin asignar'}</td>
      `;
      tablaCursos.appendChild(fila);
    });
  } catch (error) {
    console.error(error);
  }
}

const formEstudiante = document.getElementById('form-estudiante');
const tablaEstudiantes = document.getElementById('tabla-estudiantes');
const mensajeEstudiante = document.getElementById('mensaje-estudiante');

formEstudiante.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mensajeEstudiante.textContent = '';

  const nombre = document.getElementById('nombre-estudiante').value.trim();
  const correo = document.getElementById('correo-estudiante').value.trim();
  const password = document.getElementById('password-estudiante').value;

  try {
    await apiFetch('/estudiantes', {
      method: 'POST',
      body: JSON.stringify({ nombre, correo, password })
    });
    formEstudiante.reset();
    mensajeEstudiante.textContent = 'Estudiante registrado correctamente.';
    mensajeEstudiante.className = 'mensaje-exito';
    cargarEstudiantes();
  } catch (error) {
    mensajeEstudiante.textContent = error.message;
    mensajeEstudiante.className = 'mensaje-error';
  }
});

async function cargarEstudiantes() {
  try {
    const estudiantes = await apiFetch('/estudiantes');
    tablaEstudiantes.innerHTML = '';
    estudiantes.forEach((est) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${est.id}</td>
        <td>${est.nombre}</td>
        <td>${est.correo}</td>
      `;
      tablaEstudiantes.appendChild(fila);
    });
  } catch (error) {
    console.error(error);
  }
}