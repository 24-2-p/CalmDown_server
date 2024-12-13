
// 해당 팀이 존재하지 않을경우
export class TeamNotFoundError extends Error {
    errorCode = "T001";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 해당 이메일이 존재하지 않을경우
export class UserNotFoundError extends Error {
    errorCode = "U001";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}