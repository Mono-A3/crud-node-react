import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

// obtener todos los empleados
app.get('/empleados', (req, res) => {
  const sql = 'SELECT * FROM empleados';

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los empleados' });

    return res.status(200).json(result);
  });
});

// insertar un nuevo empleado
app.post('/empleados', (req, res) => {
  const { nombre, edad, pais, cargo, anios } = req.body;

  const sql = 'INSERT INTO empleados (nombre, edad, pais, cargo, anios) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [nombre, edad, pais, cargo, anios], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al insertar el empleado' });

    return res
      .status(201)
      .json({ message: 'Empleado insertado correctamente', id: result.insertId, nombre, edad, pais, cargo, anios });
  });
});

// actualizar un empleado
app.put('/empleados/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, edad, pais, cargo, anios } = req.body;

  const sql = 'UPDATE empleados SET nombre = ?, edad = ?, pais = ?, cargo = ?, anios = ? WHERE id = ?';

  db.query(sql, [nombre, edad, pais, cargo, anios, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar el empleado' });

    return res
      .status(200)
      .json({ message: 'Empleado actualizado correctamente', id, nombre, edad, pais, cargo, anios });
  });
});

// eliminar un empleado
app.delete('/empleados/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM empleados WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el empleado' });

    return res.status(200).json({ message: 'Empleado eliminado correctamente', id });
  });
});

app.listen(3000, () => {
  console.log('server running on port 3000');
});
