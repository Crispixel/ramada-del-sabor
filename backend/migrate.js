// migrate.js
// Crea las tablas necesarias en la base de datos. Se ejecuta UNA vez
// (o cada vez que cambies la estructura). Uso: npm run migrate

const pool = require('./db');

const SQL = `
CREATE TABLE IF NOT EXISTS platos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    categoria VARCHAR(60) NOT NULL,
    precio NUMERIC(6,2) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(200),
    rating INTEGER DEFAULT 5
);

CREATE TABLE IF NOT EXISTS resenas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120),
    email VARCHAR(150),
    rating INTEGER,
    comments TEXT,
    creada_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(10) NOT NULL,
    personas INTEGER NOT NULL,
    comentarios TEXT,
    estado VARCHAR(30) DEFAULT 'confirmada',
    codigo VARCHAR(20) UNIQUE NOT NULL,
    creada_en TIMESTAMP DEFAULT NOW()
);
`;

async function migrar() {
    try {
        await pool.query(SQL);
        console.log('✅ Tablas creadas o ya existentes.');
    } catch (err) {
        console.error('❌ Error creando las tablas:', err);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

migrar();
