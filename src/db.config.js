import dotenv from 'dotenv';
import mysql from 'mysql2/promise';


dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10
});

const testConnection = async () => {
    try {
        console.log('DB 연결 정보:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE
            // 비밀번호는 보안상 출력하지 않습니다
        });
        
        const connection = await pool.getConnection();
        console.log('✅ DB 연결 성공!');
        connection.release();
    } catch (error) {
        console.error('❌ DB 연결 실패:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState
        });
        throw error;  // 에러를 상위로 전파
    }
};

export {pool , testConnection} ;