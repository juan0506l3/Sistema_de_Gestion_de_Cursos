const pool = require("../config/db");

const login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const resultado = await pool.query(
            "SELECT id, nombre, correo, rol FROM usuarios WHERE correo = $1 AND password = $2",
            [correo, password]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        const usuario = resultado.rows[0];

        res.json({
            mensaje: "Login exitoso",
            usuario
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error del servidor"
        });
    }
};

module.exports = {
    login
};