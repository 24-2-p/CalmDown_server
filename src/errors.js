
// 해당 팀이 존재하지 않을경우
export class TeamNotFoundError extends Error {
    errorCode = "T001";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}