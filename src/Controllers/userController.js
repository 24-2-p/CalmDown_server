// src/Controllers/userController.js
import {  SignUpRequestDto, SignUpResponseDto,
    LoginRequestDto, LoginResponseDto  } from '../Dtos/userDto.js';
import { createUser , verifyUser  } from '../Services/userService.js';
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
    try {
        const signUpRequest = new SignUpRequestDto(req.body);

        const hashedPassword = await bcrypt.hash(signUpRequest.password, 10);

        // 사용자 생성
        const newUser = await createUser({
            email: signUpRequest.email,
            password: hashedPassword,
            name: signUpRequest.name
        });

        // 응답 생성
        const response = new SignUpResponseDto(newUser.id, newUser.email,newUser.name );
        return res.status(201).json(response);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const loginRequest = new LoginRequestDto(req.body);
        
        const user = await verifyUser(loginRequest);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "이메일 또는 비밀번호가 일치하지 않습니다"
            });
        }

        const response = new LoginResponseDto(
            user.id,
            user.email,
            user.name
        );
        return res.status(200).json(response);

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};