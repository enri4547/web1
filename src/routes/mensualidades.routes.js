import express from 'express';
import {listarPagos, registrarPago, actualizarPago, eliminarPago } from '../controladores/mensualidadesCtrl.js';

const router = express.Router();

router.get('/mensualidades', listarPagos);
router.post('/mensualidades', registrarPago);
router.put('/mensualidades/:id', actualizarPago);
router.delete('/mensualidades/:id', eliminarPago);

export default router;
