import express from 'express';
import { crearFactura, listarFacturas, obtenerFacturaPorId, actualizarFactura, eliminarFactura } from '../controladores/facturacionCtrl.js';

const router = express.Router();

router.post('/facturas', crearFactura);
router.get('/facturas', listarFacturas);
router.get('/facturas/:id', obtenerFacturaPorId);
router.put('/facturas/:id', actualizarFactura);
router.delete('/facturas/:id', eliminarFactura);

export default router;