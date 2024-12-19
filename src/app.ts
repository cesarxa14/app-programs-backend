import express from "express";
import cors from "cors";
import morgan from 'morgan';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 3000;
const app = express();
import {indexRoutes} from "./api/index";

// USAMOS CORS
app.use(cors())

app.use(morgan('dev'));

//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '10mb' }));

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

