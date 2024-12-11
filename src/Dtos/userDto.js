class SignUpRequestDto {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.name = data.name;
    }
}

class SignUpResponseDto {
    constructor(userId, email , name) {
        this.success = true;
        this.message = "회원가입이 완료되었습니다";
        this.data = {
            userId,
            email ,
            name
        };
    }
}
export class LoginRequestDto {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
    }
}

export class LoginResponseDto {
    constructor(userId, email, name) {
        this.success = true;
        this.message = "로그인이 성공했습니다";
        this.data = {
            userId,
            email,
            name
        };
    }
}
export { SignUpRequestDto, SignUpResponseDto };

// 나의 정보 요청 DTO
export const profileToUser = async (params) => {
    return {
        userId: params.userId
    };
}