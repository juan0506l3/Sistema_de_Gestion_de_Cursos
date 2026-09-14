require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "gestion_cursos_db",
    password: "postgres123",
    port: 5432
});

module.exports = pool;