// seed.js
// Inserta los platos iniciales (los que antes estaban "quemados" en server.js).
// Uso: npm run seed
// Es seguro ejecutarlo varias veces: si la tabla ya tiene datos, no duplica.

const pool = require('./db');

const platosIniciales = [
    ['Mondongo', 'tipicas', 2.00, 'La sopa de mondongo es una sopa originaria de Colombia, Venezuela, Puerto Rico República Dominicana.', 'mondongo.jpg', 5],
    ['Caldo de Salchicha', 'tipicas', 3.00, 'Caldo de salchicha o caldo de manguera es un plato tradicional de la gastronomía de Ecuador.', 'caldodesalchicha.jpg', 5],
    ['Arroz con menestra', 'tipicas', 3.00, 'Nada más casero que un plato de arroz con menestra, carne asada y patacones.', 'arrozconmenestra.jpg', 5],
    ['Lomo fino', 'carta', 6.00, 'Delicioso lomo fino a la parrilla acompañado de papas y ensalada.', 'lomo.jpg', 5],
    ['Viche de Pescado', 'carta', 5.50, 'Delicioso viche de pescado, un plato típico de la costa ecuatoriana.', 'viche.jpg', 5],
    ['Pescado Apanado', 'carta', 7.00, 'Delicioso pescado apanado, acompañado de arroz y ensalada.', 'pescadoApanado.jpg', 5]
];

async function sembrar() {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT COUNT(*) FROM platos');
        if (Number(rows[0].count) > 0) {
            console.log('ℹ️  La tabla "platos" ya tiene datos, no se insertó nada.');
            return;
        }

        for (const plato of platosIniciales) {
            await client.query(
                `INSERT INTO platos (nombre, categoria, precio, descripcion, imagen, rating)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                plato
            );
        }
        console.log(`✅ Se insertaron ${platosIniciales.length} platos.`);
    } catch (err) {
        console.error('❌ Error insertando los platos:', err);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

sembrar();
