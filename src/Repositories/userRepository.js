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

// 사용자 정보 수정기능
export const userPositionModify = async (data)=>{
    const connection = await pool.getConnection();
    try{
        // 사용자 역할 수정
        const result1 = await connection.query(
            `update USERS set position = "${data.position}" where id = ${data.userId};`,
        )

        return data.userId;
    }catch(err){
        throw new Error(`오류 발생 파라미터 확인바람 (${err})`)
    }finally {
        connection.release();
    }
}

// 기술스택 수정
export const userSkillModify = async (userId, skill)=>{
    const connection = await pool.getConnection();
    try{
        await connection.query(
            `insert into USER_TECH_STACKS (user_id, tech_name) values(${userId}, '${skill}');`
        );
    }catch(err){
        throw new Error(`오류 발생 파라미터 확인바람 (${err})`)
    }finally {
        connection.release();
    }
}

// 해당 유저의 기술스택 전부 삭제
export const userSkillDel = async (userId)=>{
    const connection = await pool.getConnection();
    try{
        await connection.query(
            `delete from USER_TECH_STACKS where user_id = ${userId};`
        )
    }catch(err){
        throw new Error(`오류 발생 파라미터 확인 (${err})`)
    }finally {
        connection.release();
    }
}