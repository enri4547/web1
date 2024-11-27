import { createPool } from "mysql2/promise";
import { BD_HOST, DB_USER, DB_PASSWORD, BD_DATABASE, DB_PORT } from './config.js';

export const conmysql = createPool({
    host: BD_HOST,
    database: BD_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT
});

// Verificar la conexión
const testConnection = async () => {
    try {
        const connection = await conmysql.getConnection();
        console.log('Conexión exitosa a la base de datos');
        connection.release();  // Liberar la conexión después de la prueba
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
    }
};

testConnection();
