const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const {indexRoutes} = require('./api/index')
const { createConnection } = require('typeorm');

const {} = require('./api/index');

app.use(cors());

//Agregamos handler para recibir json
app.use(express.json());

indexRoutes(app);

createConnection()
  .then(() => {
    console.log('Conectado a PostgreSQL');
}).catch(err => {
    console.log('Error connection: ', err)
})

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
