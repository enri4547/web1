import express from 'express';
import { listarMembresias, eliminarMembresia, crearMembresia} from '../controladores/membresiasCtrl.js';

const router = express.Router();

router.get('/membresias', listarMembresias);
router.delete('/membresias/:id', eliminarMembresia);
router.post('/membresias', crearMembresia);



export default router;