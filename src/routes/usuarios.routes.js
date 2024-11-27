import express from 'express';
import { registrarUsuario, loginUsuario, listarUsuarios, modificarUsuario, deleteUsuario } from '../controladores/usuariosCtrl.js';

const router = express.Router();

router.post('/usuarios/login', loginUsuario);
router.post('/usuarios/registrar', registrarUsuario);
router.get('/usuarios', listarUsuarios);
router.put('/usuarios/:id', modificarUsuario);
router.delete('/usuarios/:id', deleteUsuario);

export default router;