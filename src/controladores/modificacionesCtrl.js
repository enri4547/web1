import { conmysql } from '../db.js';

// Listar todas las modificaciones en la información del cliente
export const listarModificacionesClientes = async (req, res) => {
    try {
        const query = `
            SELECT 
                cli_id, cli_cedula, cli_nombres, cli_apellidos, cli_telefono, cli_email, cli_direccion, cli_estado
            FROM 
                clientes
            WHERE 
                cli_estado != 'A'`; // Considerando que solo se muestran los clientes inactivos

        const [clientes] = await conmysql.query(query);
        res.json(clientes);
    } catch (error) {
        console.error('Error al listar modificaciones de clientes:', error);
        res.status(500).json({ message: 'Error al listar modificaciones de clientes' });
    }
};

// Listar todas las modificaciones en los servicios ofrecidos
export const listarModificacionesServicios = async (req, res) => {
    try {
        const query = `
            SELECT 
                membresia_id, membresia_nombre, membresia_descripcion, membresia_precio, membresia_duracion, membresia_estado
            FROM 
                membresias
            WHERE 
                membresia_estado != 'A'`; // Solo mostramos servicios inactivos o modificados

        const [servicios] = await conmysql.query(query);
        res.json(servicios);
    } catch (error) {
        console.error('Error al listar modificaciones de servicios:', error);
        res.status(500).json({ message: 'Error al listar modificaciones de servicios' });
    }
};