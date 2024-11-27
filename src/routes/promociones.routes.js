import express from 'express';
import { listarPromociones, seleccionarPromocion, crearPromocion, eliminarPromocion } from '../controladores/promocionesCtrl.js';

const router = express.Router();

router.get('/promociones', listarPromociones);
router.post('/promociones/seleccionar', seleccionarPromocion);
router.post('/promociones', crearPromocion);
router.delete('/promociones/:id', eliminarPromocion);

export default router;