const loginForm = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    try {
        const respuesta = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo,
                password
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = datos.mensaje;
            return;
        }

        mensaje.textContent = `Bienvenido ${datos.usuario.nombre}. Rol: ${datos.usuario.rol}`;

        console.log("Usuario:", datos.usuario);

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar con el servidor";
    }
});