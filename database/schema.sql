DROP TABLE IF EXISTS calificaciones CASCADE;
DROP TABLE IF EXISTS inscripciones CASCADE;
DROP TABLE IF EXISTS cursos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'docente', 'estudiante'))
);

CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    docente_id INTEGER REFERENCES usuarios(id)
);

CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    estudiante_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE (curso_id, estudiante_id)
);

CREATE TABLE calificaciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    nota NUMERIC(3,1) NOT NULL CHECK (nota >= 0 AND nota <= 5),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO usuarios (nombre, correo, password, rol) VALUES
('Carlos Admin', 'admin@unisabaneta.edu.co', 'admin123', 'administrador'),
('Laura Docente', 'docente@unisabaneta.edu.co', 'docente123', 'docente'),
('Andrés Estudiante', 'estudiante@unisabaneta.edu.co', 'estudiante123', 'estudiante');

INSERT INTO cursos (nombre, docente_id) VALUES
('Arquitectura de Software', 2),
('Bases de Datos', 2);

INSERT INTO inscripciones (curso_id, estudiante_id) VALUES
(1, 3),
(2, 3);