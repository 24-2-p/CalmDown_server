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
export const userModify = async (data)=>{
    const connection = await pool.getConnection();
    try{
        // 사용자 역할 수정
        const result1 = await connection.query(
            `update users set position = "${data.position}" where id = ${data.userId};`,
        )

        const skills = data.skill.map(skill => `SELECT '${skill}'`).join(' union all ');
        const fromSQL = `(${skills}) AS new_techs(tech_name)`;


        //기술스택 추가하기
        const [result2] = await connection.query(
            `insert into user_tech_stacks (user_id, tech_name)
            select ${data.userId}, tech_name
            from ${fromSQL}
            where tech_name NOT IN (
                select tech_name
                from User_tech_stacks
                where user_id = ${data.userId}
            );`
        )

        const mySkill = data.skill.map(skill => `'${skill}'`).join(', ');

        // 필요없는 기술 스택 삭제 (deleteStack에 등록된 기술스택 제외하고 다 삭제)
        const [deleteStackResults] = await connection.query(
            `delete from user_tech_stacks 
            where user_id = ${data.userId} and tech_name not in (${mySkill});`
        )
        return data.userId;
    }catch(err){
        throw new Error(`오류 발생 파라미터 확인바람 (${err})`)
    }finally {
        connection.release();
    }
}