// src/Repositories/userRepository.js
import { pool } from '../db.config.js';

export const createUserRepo = async (userData) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query(
            'INSERT INTO USERS (email, password, name) VALUES (?, ?, ?)',
            [userData.email, userData.password, userData.name]
        );
        
        return {
            id: result.insertId,
            email: userData.email,
            name: userData.name
        };
    } finally {
        connection.release();
    }
};

export const findUserByEmail = async (email) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'SELECT id, email, password, name FROM USERS WHERE email = ?',
            [email]
        );
        
        return rows[0] || null;
    } finally {
        connection.release();
    }
};