// db.js
// Configura la conexión a PostgreSQL usando la variable de entorno DATABASE_URL.
// Esa variable te la da automáticamente Render (o Railway) cuando creas la base
// de datos y la vinculas a este servicio. En local, la tomas de tu archivo .env.

require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Render (y la mayoría de proveedores en la nube) exigen SSL para conectarse
    // a la base de datos desde fuera de su propia red interna.
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de PostgreSQL', err);
});

module.exports = pool;
