const API_BASE = 'http://localhost:3000/api';

function obtenerUsuario() {
  const datos = localStorage.getItem('usuario');
  return datos ? JSON.parse(datos) : null;
}

function guardarUsuario(usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

function cerrarSesion() {
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

function exigirRol(rolesPermitidos) {
  const usuario = obtenerUsuario();
  if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
    window.location.href = 'login.html';
    return null;
  }
  return usuario;
}

async function apiFetch(ruta, opciones = {}) {
  const usuario = obtenerUsuario();
  const headers = {
    'Content-Type': 'application/json',
    ...(opciones.headers || {})
  };

  if (usuario) {
    headers['x-usuario-id'] = usuario.id;
    headers['x-usuario-rol'] = usuario.rol;
  }

  const respuesta = await fetch(`${API_BASE}${ruta}`, { ...opciones, headers });
  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(datos.error || datos.mensaje || 'Ocurrió un error inesperado.');
  }
  return datos;
}

function pintarEncabezado(usuario) {
  const nombreSpan = document.getElementById('nombre-usuario');
  const rolSpan = document.getElementById('rol-usuario');
  if (nombreSpan) nombreSpan.textContent = usuario.nombre;
  if (rolSpan) rolSpan.textContent = usuario.rol;

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', cerrarSesion);
}