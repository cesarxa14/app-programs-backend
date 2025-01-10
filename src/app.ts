import express from "express";
import cors from "cors";
import morgan from 'morgan';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

import { indexRoutes } from "./api/index";

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
indexRoutes(app);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal Server Error' });
});

// HTTPS Server Options
const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/clientes.nadaresvidaperu.pe/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/clientes.nadaresvidaperu.pe/fullchain.pem')
};

// Start HTTPS server
const initilizeApp = async () => {
    try {
        https.createServer(httpsOptions, app).listen(PORT, () => {
            console.log(`Server running on https://localhost:${PORT}`);
        });
    } catch (err) {
        console.log('Error -> Initilize app -> ', err);
    }
}

initilizeApp();
