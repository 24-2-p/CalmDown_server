// src/Controllers/userController.js
import {
    SignUpRequestDto, SignUpResponseDto,
    LoginRequestDto, LoginResponseDto, profileToUser, modifyToUser
} from '../Dtos/userDto.js';
import {createUser, myProfile, userInfoModify, verifyUser} from '../Services/userService.js';
import bcrypt from 'bcrypt';
import {StatusCodes} from "http-status-codes";

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


// 나의 정보 출력 기능
export const handlerMyProfileInfo = async (req,res) =>{
    const myInfo = await myProfile(profileToUser(req.params));

    res.status(StatusCodes.OK).success(myInfo);
};

// 나의 역활군 수정 기능
export const handlerMyInfoModify = async (req,res)=>{
    const result = await userInfoModify(modifyToUser(req.body, req.params));
    res.status(StatusCodes.OK).success(result);
}

