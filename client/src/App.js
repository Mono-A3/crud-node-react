import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estados para guardar lo que el usuario escriba
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState('');
  const [cargo, setCargo] = useState('');
  const [anios, setAnios] = useState(0);

  // Lista que contiene todos los empleados registrados
  const [registros, setRegistros] = useState([]);

  // Estado qu ese usa para saber si estamos registrando o editando
  const [editIndex, setEditIndex] = useState(null);

  // Cuando se carga la pagina obtenemos los empleados
  useEffect(() => {
    try {
      //definimos la funcion para cargar empleados
      const cargarEmpleados = async () => {
        const response = await fetch('http://localhost:3000/empleados');
        const data = await response.json();
        setRegistros(data);
      };

      cargarEmpleados();
    } catch (err) {
      alert('Error al cargar empleados');
    }
  }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setEdad(0);
    setPais('');
    setCargo('');
    setAnios(0);
  };

  // Esta funcion se ejecuta al presionar el boton registrar o actualizar
  const registrarDatos = async (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      try {
        const empleado = registros[editIndex];
        const response = await fetch(`http://localhost:3000/empleados/${empleado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre,
            edad,
            pais,
            cargo,
            anios,
          }),
        });

        if (response.ok) {
          const nuevosRegistros = [...registros];

          nuevosRegistros[editIndex] = { ...empleado, nombre, edad, pais, cargo, anios };
          setRegistros(nuevosRegistros);
          setEditIndex(null);
          alert('Empleado actualizado correctamente');
        } else {
          alert('Error al actualizar el empleado');
        }
      } catch (err) {
        alert('Error de conexion al actualizar');
      }
    } else {
      // Registrar nuevo empleado
      try {
        const response = await fetch('http://localhost:3000/empleados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre,
            edad,
            pais,
            cargo,
            anios,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setRegistros([...registros, data]);
          alert('Empleado registrado correctamente');
        } else {
          alert('Error al registrar el empleado');
        }
      } catch (err) {
        alert('Error de conexion al registrar');
      }
    }

    limpiarFormulario();
  };

  // Esta funcion elimina el empleado
  const eliminarRegistro = async (idx) => {
    const empleado = registros[idx];

    try {
      const response = await fetch(`http://localhost:3000/empleados/${empleado.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));

        if (editIndex === idx) {
          setEditIndex(null);
          limpiarFormulario();
        }

        alert('Empleado eliminado correctamente');
      } else {
        alert('Error al eliminar el empleado');
      }
    } catch (err) {
      alert('Error de conexion al eliminar');
    }
  };

  const editarRegistro = async (idx) => {
    const reg = registros[idx];
    setNombre(reg.nombre);
    setEdad(reg.edad);
    setPais(reg.pais);
    setCargo(reg.cargo);
    setAnios(reg.anios);
    setEditIndex(idx);
  };

  return (
    <div className='App'>
      {/* Contenedor principal de la aplicación */}

      <div className='App-header'>
        <h1>🚀 Gestión de Empleados</h1>
        <p>Administra la información de tus empleados de forma sencilla</p>
      </div>

      {/* Formulario para ingresar los datos */}
      <div className='datos'>
        {/* Contenedor del formulario */}
        <label>
          {' '}
          Nombre:{/* Etiqueta del input de nombre */}
          <input
            type='text' /* Campo de texto */
            value={nombre} /* Valor controlado por el estado 'nombre' */
            onChange={(e) => setNombre(e.target.value)} /* Actualiza 'nombre' al escribir */
          />
        </label>
        <label>
          {' '}
          Edad:{/* Etiqueta del input de edad */}
          <input
            type='number' /* Campo numérico */
            value={edad} /* Valor controlado por 'edad' */
            onChange={(e) => setEdad(Number(e.target.value))} /* Convierte a número y guarda */
          />
        </label>
        <label>
          {' '}
          País:{/* Etiqueta del input de país */}
          <input
            type='text' /* Campo de texto */
            value={pais} /* Valor controlado por 'pais' */
            onChange={(e) => setPais(e.target.value)} /* Actualiza 'pais' */
          />
        </label>
        <label>
          {' '}
          Cargo:{/* Etiqueta del input de cargo */}
          <input
            type='text' /* Campo de texto */
            value={cargo} /* Valor controlado por 'cargo' */
            onChange={(e) => setCargo(e.target.value)} /* Actualiza 'cargo' */
          />
        </label>
        <label>
          {' '}
          Años:{/* Etiqueta del input de años de experiencia */}
          <input
            type='number' /* Campo numérico */
            value={anios} /* Valor controlado por 'anios' */
            onChange={(e) => setAnios(Number(e.target.value))} /* Convierte a número y guarda */
          />
        </label>

        {/* Botón que cambia de texto dependiendo si es nuevo o edición */}
        <button onClick={registrarDatos}>
          {editIndex !== null ? 'Actualizar' : 'Registrar'}
          {/* Texto dinámico del botón */}
        </button>
      </div>

      {/* Tabla con los empleados registrados */}
      {registros.length > 0 /* Solo mostramos la tabla si hay registros */ && (
        <div className='tabla-container'>
          {/* Contenedor para estilos de la tabla */}
          <table className='tabla-registros'>
            {/* Tabla de empleados */}
            <thead>
              {/* Cabecera de la tabla */}
              <tr>
                {/* Fila de encabezados */}
                <th>Nombre</th>
                {/* Columna: Nombre */}
                <th>Edad</th>
                {/* Columna: Edad */}
                <th>País</th>
                {/* Columna: País */}
                <th>Cargo</th>
                {/* Columna: Cargo */}
                <th>Años</th>
                {/* Columna: Años de experiencia */}
                <th>Acciones</th>
                {/* Columna: Botones de acción */}
              </tr>
            </thead>
            <tbody>
              {/* Cuerpo de la tabla */}
              {registros.map((reg, idx /* Recorremos cada registro con su índice */) => (
                <tr key={idx}>
                  {/* Fila por empleado (key = índice) */}
                  <td>{reg.nombre}</td>
                  {/* Celda: nombre del empleado */}
                  <td>{reg.edad}</td>
                  {/* Celda: edad del empleado */}
                  <td>{reg.pais}</td>
                  {/* Celda: país del empleado */}
                  <td>{reg.cargo}</td>
                  {/* Celda: cargo del empleado */}
                  <td>{reg.anios}</td>
                  {/* Celda: años de experiencia */}
                  <td>
                    {/* Celda: acciones */}
                    <button
                      className='btn-editar' /* Clase CSS para estilos */
                      onClick={() => editarRegistro(idx)} /* Al hacer clic, cargamos los datos en el formulario */
                    >
                      Editar
                    </button>
                    <button
                      className='btn-eliminar' /* Clase CSS para estilos */
                      onClick={() => eliminarRegistro(idx)} /* Al hacer clic, eliminamos el registro */
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
