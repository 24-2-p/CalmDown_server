class UserController {
    async signup(req, res) {
        try {
            // 회원가입 로직
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            // 로그인 로직
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new UserController();