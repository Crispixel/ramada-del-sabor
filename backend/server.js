require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Si defines FRONTEND_URL en las variables de entorno, solo esa URL podrá
// llamar a la API en producción. Si no la defines, se permite cualquier origen
// (más simple, útil mientras pruebas).
const corsOptions = process.env.FRONTEND_URL
    ? { origin: process.env.FRONTEND_URL }
    : {};

app.use(cors(corsOptions));
app.use(express.json());

// Horarios de atención del restaurante
const HORARIOS_DISPONIBLES = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

// RUTAS

// Ping simple para comprobar que el backend y la base de datos están vivos
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ ok: true, db: 'conectada' });
    } catch (err) {
        res.status(500).json({ ok: false, db: 'error', detalle: err.message });
    }
});

// Obtener todos los platos
app.get('/api/platos', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM platos ORDER BY id');
    res.json(rows);
});

// Guardar una reseña
app.post('/api/resenas', async (req, res) => {
    const { name, email, rating, comments } = req.body;

    if (!name || !comments) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios para la reseña.' });
    }

    const { rows } = await pool.query(
        `INSERT INTO resenas (name, email, rating, comments)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email || null, rating || null, comments]
    );

    console.log('Reseña guardada:', rows[0]);
    res.status(201).json({ mensaje: 'Reseña guardada con éxito', resena: rows[0] });
});

// Obtener los horarios disponibles para reservar
app.get('/api/reservas/horarios', (req, res) => {
    res.json(HORARIOS_DISPONIBLES);
});

// Obtener todas las reservas (útil para revisión/admin)
app.get('/api/reservas', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM reservas ORDER BY creada_en DESC');
    res.json(rows);
});

// Crear una nueva reserva
app.post('/api/reservas', async (req, res) => {
    const { nombre, email, telefono, fecha, hora, personas, comentarios } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !email || !telefono || !fecha || !hora || !personas) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios para la reserva.' });
    }

    // La fecha no puede ser anterior a hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaReserva = new Date(fecha + 'T00:00:00');
    if (fechaReserva < hoy) {
        return res.status(400).json({ mensaje: 'La fecha de la reserva no puede ser anterior a hoy.' });
    }

    // El horario debe ser uno de los disponibles
    if (!HORARIOS_DISPONIBLES.includes(hora)) {
        return res.status(400).json({ mensaje: 'El horario seleccionado no está disponible.' });
    }

    const codigo = `RSV-${Date.now().toString().slice(-6)}`;

    const { rows } = await pool.query(
        `INSERT INTO reservas (nombre, email, telefono, fecha, hora, personas, comentarios, estado, codigo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmada', $8)
         RETURNING *`,
        [nombre, email, telefono, fecha, hora, Number(personas), comentarios || '', codigo]
    );

    console.log('Reserva guardada:', rows[0]);
    res.status(201).json({ mensaje: 'Reserva confirmada con éxito', reserva: rows[0] });
});

// Manejador de errores centralizado: si cualquier ruta async lanza un error
// (por ejemplo, falla la base de datos), esto evita que el servidor se caiga.
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
