import express from 'express';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import usuariosRoutes from './routes/usuarios.routes.js';  
import facturacionRoutes from './routes/facturacion.routes.js';
import membresiasRoutes from './routes/membresias.routes.js';  
import promocionesRoutes from './routes/promociones.routes.js'; 
import mensualidadesRoutes from './routes/mensualidades.routes.js';  


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const corsOptions={
    origin:'*',
    methods:['GET','POST','PUT','PATCH','DELETE'],
    credentials:true
}

app.use(cors(corsOptions));
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

// Rutas
app.use('/API2024_2_Proyecto', usuariosRoutes);
app.use('/API2024_2_Proyecto', facturacionRoutes);
app.use('/API2024_2_Proyecto', mensualidadesRoutes);
app.use('/API2024_2_Proyecto', membresiasRoutes);
app.use('/API2024_2_Proyecto', promocionesRoutes);


app.use('/uploads',express.static(path.join(__dirname,'../uploads')));


app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

export default app;
