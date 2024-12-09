// src/Services/userService.js
import { createUserRepo , findUserByEmail  } from '../Repositories/userRepository.js';
import bcrypt from 'bcrypt';

export const createUser = async (userData) => {
    try {
        return await createUserRepo(userData);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('이미 존재하는 이메일입니다');
        }
        throw error;
    }
};

export const verifyUser = async (loginData) => {
    try {
        const user = await findUserByEmail(loginData.email);
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
        if (!isPasswordValid) return null;

        return user;
    } catch (error) {
        throw error;
    }
};