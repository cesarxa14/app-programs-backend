import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();
import {indexRoutes} from "./api/index";

// USAMOS CORS
app.use(cors())

//Agregamos handler para recibir json
app.use(express.json());

//Inicializar el router de express con todos los endpoint
indexRoutes(app)
const initilizeApp = async () => {
    try{
        // LEVANTAR EL SERVIDOR 
        app.listen(PORT, () => {
            console.log(`Server on port ${PORT}`)
        })
  
    } catch(err) {
        console.log('Error -> Initilize app -> ', err)
    }
    
}

initilizeApp();

