import { conmysql } from '../db.js';

// Iniciar sesión
export const loginUsuario = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [result] = await conmysql.query(
            'SELECT * FROM usuarios WHERE username = ? AND password = ?',
            [username, password]
        );
        if (result.length === 0) return res.status(401).json({ message: "Credenciales inválidas" });
        
        // Obtener el rol del usuario
        const usuario = result[0];
        res.json({
            message: "Inicio de sesión exitoso",
            usuario: {
                id: usuario.id,
                username: usuario.username,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

// Registrar nuevo usuario (cliente o empleado)
export const registrarUsuario = async (req, res) => {
    try {
        const {
            username,
            password,
            rol, // 'cliente' o 'empleado'
            cli_cedula,
            cli_nombres, // Asegúrate de que este campo se está enviando correctamente
            cli_apellido,
            cli_telefono,
            cli_email,
            cli_direccion,
            cli_estado,
            emp_cedula, // solo se usa si el rol es 'empleado'
            emp_nombres, // solo se usa si el rol es 'empleado'
            emp_apellidos, // solo se usa si el rol es 'empleado'
            emp_telefono, // solo se usa si el rol es 'empleado'
            emp_email, // solo se usa si el rol es 'empleado'
            emp_cargo // solo se usa si el rol es 'empleado'
        } = req.body;

        // Verificar que los campos necesarios estén presentes
        if (rol === 'cliente') {
            if (!cli_nombres || !cli_apellido || !cli_telefono || !cli_email || !cli_direccion || !cli_estado) {
                return res.status(400).json({ message: 'Faltan campos obligatorios para cliente' });
            }

            const sql = `INSERT INTO clientes (cli_cedula, cli_nombres, cli_apellidos, cli_telefono, cli_email, cli_direccion, cli_estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [cli_cedula, cli_nombres, cli_apellido, cli_telefono, cli_email, cli_direccion, cli_estado];
            
            await conmysql.query(sql, values);

            // Insertamos el usuario en la tabla usuarios
            const userSql = `INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)`;
            await conmysql.query(userSql, [username, password, 'cliente']);
        } else if (rol === 'empleado') {
            if (!emp_nombres || !emp_apellidos || !emp_telefono || !emp_email || !emp_cargo) {
                return res.status(400).json({ message: 'Faltan campos obligatorios para empleado' });
            }

            const sql = `INSERT INTO empleados (emp_cedula, emp_nombres, emp_apellidos, emp_telefono, emp_email, emp_cargo, emp_estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [emp_cedula, emp_nombres, emp_apellidos, emp_telefono, emp_email, emp_cargo, 'A'];

            await conmysql.query(sql, values);

            // Insertamos el usuario en la tabla usuarios
            const userSql = `INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)`;
            await conmysql.query(userSql, [username, password, 'empleado']);
        }

        // Respondemos que todo fue exitoso
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};




// Listar usuarios (solo jefes)
export const listarUsuarios = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM usuarios WHERE rol = "jefe"');
        res.json(result);
    } catch (error) {
        console.error('Error al listar usuarios', error);
        res.status(500).json({ message: "Error al listar usuarios" });
    }
};

// Modificar información de un usuario
export const modificarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, rol, cli_id, emp_id } = req.body;

        if ((rol === 'cliente' && !cli_id) || (rol === 'empleado' && !emp_id)) {
            return res.status(400).json({ message: "Se debe proporcionar el ID del cliente o empleado según corresponda." });
        }

        const [result] = await conmysql.query(
            'UPDATE usuarios SET username = ?, password = ?, rol = ?, cli_id = ?, emp_id = ? WHERE id = ?',
            [username, password, rol, cli_id || null, emp_id || null, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario actualizado con éxito" });
    } catch (error) {
        console.error('Error al modificar usuario', error);
        res.status(500).json({ message: "Error al modificar usuario" });
    }
}

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query('DELETE FROM tb_usuarios WHERE id = ?', [id]);
        if (result.affectedRows <= 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al eliminar usuario' });
    }
};
