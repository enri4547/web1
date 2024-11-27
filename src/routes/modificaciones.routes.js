import express from 'express';
import { listarModificacionesClientes, listarModificacionesServicios } from '../controladores/modificacionesCtrl.js';

const router = express.Router();

router.get('/modificaciones/clientes', listarModificacionesClientes);
router.get('/modificaciones/servicios', listarModificacionesServicios);

export default router;