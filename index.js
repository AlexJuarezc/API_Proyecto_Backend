require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7050;
const db = require('./db'); // Cliente SQLite Cloud

app.use(express.json());
app.use(cors()); 
app.use(express.static(path.join(__dirname, 'public')));

// 📌 **Verificación de conexión a la base de datos**
(async () => {
  try {
    const [row] = await db.sql('SELECT 1 AS ok;');
    if (row.ok === 1) {
      console.log('✅ Conexión a SQLite Cloud verificada correctamente.');
    } else {
      console.warn('⚠️ Conexión establecida, pero la consulta de prueba devolvió:', row);
    }
  } catch (err) {
    console.error('❌ No se pudo verificar la conexión a SQLite Cloud:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
})();

// Ruta para obtener Usuarios
app.get('/api/users', async (req, res) => {
  try {
    const rows = await db.sql(`SELECT dni, nombre, email FROM Personas;`);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'No se pudieron obtener usuarios' });
  }
});

// Ruta para obtener Pacientes
app.get('/api/patients', async (req, res) => {
  try {
    const rows = await db.sql(`SELECT c.id_cuenta,  p.nombre, p.email FROM
Personas p JOIN Cuentas c ON c.dni=p.dni;`);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener pacientes:', err);
    res.status(500).json({ error: 'No se pudieron obtener pacientes' });
  }
});

// Ruta para obtener Médicos
app.get('/api/doctors', async (req, res) => {
  try {
    const rows = await db.sql(`SELECT 
    m.legajo, 
    p.nombre,
    p.apellido,
    e.nombre_especialidad, 
    p.telefono
FROM 
    Medicos m
JOIN Personas p ON p.dni = m.dni
JOIN Especialidades e ON e.id_especialidad = m.id_especialidad;`);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener médicos:', err);
    res.status(500).json({ error: 'No se pudieron obtener médicos' });
  }
});

