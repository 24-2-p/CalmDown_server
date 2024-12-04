class UserRepository {
    async CheckUser(email) {
        // DB에서 유저 찾기
    }

    async UserCreate(userDto) {
        // DB에 유저 생성
    }
}

module.exports = new UserRepository();