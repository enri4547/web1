import { conmysql } from '../db.js';

// Listar pagos con estado y alertas de vencimiento
export const listarPagos = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.pago_id,
                c.cli_nombres AS cliente_nombre,
                c.cli_apellidos AS cliente_apellido,
                p.pago_fecha,
                p.pago_monto,
                m.membresia_nombre AS plan_nombre,
                p.pago_metodo AS metodo_pago,
                DATEDIFF(DATE_ADD(p.pago_fecha, INTERVAL m.membresia_duracion DAY), CURDATE()) AS dias_restantes
            FROM 
                pagos p
            INNER JOIN 
                clientes c ON p.cli_id = c.cli_id
            INNER JOIN 
                membresias m ON p.plan_id = m.membresia_id
            WHERE 
                c.cli_estado = 'A'
        `;

        const [pagos] = await conmysql.query(query);

        // Añadir alerta de vencimiento
        const pagosConAlertas = pagos.map(pago => ({
            ...pago,
            alerta: pago.dias_restantes <= 7
                ? pago.dias_restantes < 0
                    ? 'Vencida'
                    : 'Próxima a vencer'
                : 'Al día',
        }));

        res.json(pagosConAlertas);
    } catch (error) {
        console.error('Error al listar pagos:', error);
        res.status(500).json({ message: 'Error al listar pagos' });
    }
};

// Registrar un nuevo pago
export const registrarPago = async (req, res) => {
    try {
        const { cli_id, plan_id, emp_id, pago_fecha, pago_monto, pago_metodo } = req.body;

        const query = `
            INSERT INTO pagos (cli_id, plan_id, emp_id, pago_fecha, pago_monto, pago_metodo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await conmysql.query(query, [cli_id, plan_id, emp_id, pago_fecha, pago_monto, pago_metodo]);
        res.status(201).json({ message: 'Pago registrado exitosamente', pago_id: result.insertId });
    } catch (error) {
        console.error('Error al registrar pago:', error);
        res.status(500).json({ message: 'Error al registrar pago' });
    }
};

// Actualizar un pago
export const actualizarPago = async (req, res) => {
    try {
        const { id } = req.params;
        const { pago_monto, pago_metodo } = req.body;

        const query = `
            UPDATE pagos
            SET pago_monto = ?, pago_metodo = ?
            WHERE pago_id = ?
        `;

        const [result] = await conmysql.query(query, [pago_monto, pago_metodo, id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Pago no encontrado' });

        res.json({ message: 'Pago actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar pago:', error);
        res.status(500).json({ message: 'Error al actualizar pago' });
    }
};

export const eliminarPago = async (req, res) => {
    try {
        const { id } = req.params; // Aquí debes obtener el id desde la URL

        console.log('Eliminando pago con ID:', id); // Verifica que el ID esté llegando correctamente

        const query = `
            DELETE FROM pagos
            WHERE pago_id = ?
        `;

        const [result] = await conmysql.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        res.json({ message: 'Pago eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar pago:', error);
        res.status(500).json({ message: 'Error al eliminar pago' });
    }
}
