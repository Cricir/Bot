const sqlite3 = require('sqlite3').verbose();

// Establece la ruta y el nombre de la base de datos
const dbPath = 'BaseDatos.db';

// Crea una nueva conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Cierra la conexión cuando hayas terminado
db.close((err) => {
  if (err) {
    console.error('Error al cerrar la base de datos:', err.message);
  } else {
    console.log('Conexión cerrada correctamente');
  }
});
