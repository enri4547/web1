import { conmysql } from '../db.js';

// Crear una nueva factura
export const crearFactura = async (req, res) => {
    try {
        const { cli_id, emp_id, fecha, total, estado } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO facturas (cli_id, emp_id, fecha, total, estado) VALUES (?, ?, ?, ?, ?)',
            [cli_id, emp_id, fecha, total, estado]
        );
        res.status(201).json({ message: 'Factura creada exitosamente', id_factura: result.insertId });
    } catch (error) {
        console.error('Error al crear factura', error);
        res.status(500).json({ message: 'Error al crear factura' });
    }
};

// Listar todas las facturas
export const listarFacturas = async (req, res) => {
    try {
        const query = `
            SELECT 
                f.id_factura, f.fecha, f.total, f.estado, 
                c.cli_id, c.cli_nombres, c.cli_apellidos, c.cli_cedula,
                e.emp_id, e.emp_nombres, e.emp_apellidos
            FROM 
                facturas f
            JOIN 
                clientes c ON f.cli_id = c.cli_id
            JOIN 
                empleados e ON f.emp_id = e.emp_id
        `;
        const [facturas] = await conmysql.query(query);
        res.json(facturas);
    } catch (error) {
        console.error('Error al listar facturas', error);
        res.status(500).json({ message: 'Error al listar facturas' });
    }
};

// Obtener una factura por ID
export const obtenerFacturaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [factura] = await conmysql.query('SELECT * FROM facturas WHERE id_factura = ?', [id]);
        if (factura.length === 0) return res.status(404).json({ message: 'Factura no encontrada' });
        res.json(factura[0]);
    } catch (error) {
        console.error('Error al obtener factura', error);
        res.status(500).json({ message: 'Error al obtener factura' });
    }
};

// Actualizar una factura
export const actualizarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const { cli_id, emp_id, fecha, total, estado } = req.body;
        const [result] = await conmysql.query(
            'UPDATE facturas SET cli_id = ?, emp_id = ?, fecha = ?, total = ?, estado = ? WHERE id_factura = ?',
            [cli_id, emp_id, fecha, total, estado, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Factura no encontrada' });
        res.json({ message: 'Factura actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar factura', error);
        res.status(500).json({ message: 'Error al actualizar factura' });
    }
};

// Eliminar una factura
export const eliminarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query('DELETE FROM facturas WHERE id_factura = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Factura no encontrada' });
        res.json({ message: 'Factura eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar factura', error);
        res.status(500).json({ message: 'Error al eliminar factura' });
    }
};