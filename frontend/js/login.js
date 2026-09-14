const formLogin = document.getElementById('form-login');
const mensajeErrorLogin = document.getElementById('error-login');

formLogin.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mensajeErrorLogin.textContent = '';

  const correo = document.getElementById('correo').value.trim();
  const password = document.getElementById('password').value;

  try {
    const respuesta = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensajeErrorLogin.textContent = datos.mensaje || 'No fue posible iniciar sesión.';
      return;
    }

    guardarUsuario(datos.usuario);

    const destinos = {
      administrador: 'admin.html',
      docente: 'docente.html',
      estudiante: 'estudiante.html'
    };

    window.location.href = destinos[datos.usuario.rol] || 'login.html';
  } catch (error) {
    console.error(error);
    mensajeErrorLogin.textContent = 'No se pudo conectar con el servidor.';
  }
});