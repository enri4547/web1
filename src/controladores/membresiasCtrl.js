import { conmysql } from '../db.js';

// Listar todas las membresías activas
export const listarMembresias = async (req, res) => {
    try {
        const query = `
            SELECT 
                membresia_id, membresia_nombre, membresia_descripcion, membresia_precio, membresia_duracion, membresia_estado 
            FROM 
                membresias
            WHERE 
                membresia_estado = 'A'
        `;
        
        const [membresias] = await conmysql.query(query);
        res.json(membresias);
    } catch (error) {
        console.error('Error al listar membresías:', error);
        res.status(500).json({ message: 'Error al listar membresías' });
    }
};

export const eliminarMembresia = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query('DELETE FROM membresias WHERE membresia_id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Membresia no encontrada' });
        res.json({ message: 'Membresia eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar membresia:', error);
        res.status(500).json({ message: 'Error al eliminar membresia' });
    }
};

// Crear una nueva 
export const crearMembresia= async (req, res) => {
    try {
        const { membresia_nombre, membresia_descripcion, membresia_precio, membresia_duracion, membresia_estado} = req.body;

        const query = `
            INSERT INTO membresias (membresia_nombre, membresia_descripcion, membresia_precio, membresia_duracion, membresia_estado)
            VALUES (?, ?, ?, ?, ?)`;

        const [result] = await conmysql.query(query, [membresia_nombre, membresia_descripcion, membresia_precio, membresia_duracion, membresia_estado]);
        res.status(201).json({ message: 'Membresia creada exitosamente', membresia_id: result.insertId });
    } catch (error) {
        console.error('Error al crear Membresia:', error);
        res.status(500).json({ message: 'Error al crear Membresia' });
    }
};