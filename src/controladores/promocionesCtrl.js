import { conmysql } from '../db.js';

// Listar todas las promociones activas y vigentes
export const listarPromociones = async (req, res) => {
    try {
        const query = `
            SELECT 
                promo_id, promo_nombre, promo_descripcion, promo_descuento, promo_fecha_inicio, promo_fecha_fin 
            FROM 
                promociones
            WHERE 
                promo_estado = 'A'
                AND (
                    (MONTH(promo_fecha_inicio) = MONTH(CURDATE()) AND YEAR(promo_fecha_inicio) = YEAR(CURDATE()))
                    OR
                    (MONTH(promo_fecha_fin) = MONTH(CURDATE()) AND YEAR(promo_fecha_fin) = YEAR(CURDATE()))
                    OR
                    (MONTH(promo_fecha_inicio) = MONTH(DATE_ADD(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(promo_fecha_inicio) = YEAR(DATE_ADD(CURDATE(), INTERVAL 1 MONTH)))
                    OR
                    (MONTH(promo_fecha_fin) = MONTH(DATE_ADD(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(promo_fecha_fin) = YEAR(DATE_ADD(CURDATE(), INTERVAL 1 MONTH)))
                )
        `;
        
        const [promociones] = await conmysql.query(query);
        res.json(promociones);
    } catch (error) {
        console.error('Error al listar promociones:', error);
        res.status(500).json({ message: 'Error al listar promociones' });
    }
};

// Seleccionar una promoción para agregar al carrito
export const seleccionarPromocion = async (req, res) => {
    try {
        const { promo_id, cliente_id } = req.body;

        // Verificar si la promoción es válida (activa y vigente)
        const [promoValida] = await conmysql.query(
            `SELECT promo_id FROM promociones 
            WHERE promo_id = ? 
            AND promo_estado = 'A' 
            AND promo_fecha_inicio <= CURDATE() 
            AND promo_fecha_fin >= CURDATE()`,
            [promo_id]
        );

        if (promoValida.length === 0) {
            return res.status(400).json({ message: 'Promoción no válida o expirada' });
        }

        // Insertar en el carrito
        const queryCarrito = `
            INSERT INTO carrito (cliente_id, promo_id) 
            VALUES (?, ?)`;

        await conmysql.query(queryCarrito, [cliente_id, promo_id]);

        res.json({ message: 'Promoción agregada al carrito exitosamente' });
    } catch (error) {
        console.error('Error al seleccionar promoción:', error);
        res.status(500).json({ message: 'Error al agregar la promoción al carrito' });
    }
};

// Crear una nueva promoción
export const crearPromocion = async (req, res) => {
    try {
        const { promo_nombre, promo_descripcion, promo_descuento, promo_fecha_inicio, promo_fecha_fin, promo_estado } = req.body;

        const query = `
            INSERT INTO promociones (promo_nombre, promo_descripcion, promo_descuento, promo_fecha_inicio, promo_fecha_fin, promo_estado)
            VALUES (?, ?, ?, ?, ?, ?)`;

        const [result] = await conmysql.query(query, [promo_nombre, promo_descripcion, promo_descuento, promo_fecha_inicio, promo_fecha_fin, promo_estado]);
        res.status(201).json({ message: 'Promoción creada exitosamente', promo_id: result.insertId });
    } catch (error) {
        console.error('Error al crear promoción:', error);
        res.status(500).json({ message: 'Error al crear promoción' });
    }
};

// Eliminar una promoción
export const eliminarPromocion = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query('DELETE FROM promociones WHERE promo_id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Promoción no encontrada' });
        res.json({ message: 'Promoción eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar promoción:', error);
        res.status(500).json({ message: 'Error al eliminar promoción' });
    }
};