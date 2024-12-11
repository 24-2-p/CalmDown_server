// Dtos/matchingDto.js

/**
 * 매칭 시작 요청 DTO
 */
export class MatchingRequestDto {
    constructor(data) {
        /** @type {number} 매칭 신청자 ID (users.id) */
        this.userId = data.userId;
        
        /** @type {number} 선택한 프로젝트 ID (projects.id) */
        this.projectId = data.projectId;
        
        /** @type {string} 포지션 ('frontend'|'backend'|'ai'|'iot') (users.position) */
        this.position = data.position;
        
        /** @type {string[]} 기술 스택 배열 (user_tech_stacks.tech_name) */
        this.techStacks = data.techStacks;
        
        /** @type {string} 포트폴리오 링크 (users.portfolio) */
        this.portfolio = data.portfolio;
        
        /** @type {string[]} 팀원 이메일 배열 (선택적) */
        this.teamEmails = data.teamEmails || [];
    }
}

/**
 * 팀원 정보 DTO
 */
export class TeamMemberDto {
    constructor(data) {
        /** @type {string} 팀원 이름 (users.name) */
        this.name = data.name;
        
        /** @type {string} 포지션 (users.position) */
        this.position = data.position;
        
        /** @type {string} 포트폴리오 링크 (users.portfolio) */
        this.portfolio = data.portfolio;
        
        /** @type {string[]} 기술 스택 배열 (user_tech_stacks.tech_name) */
        this.techStacks = data.techStacks;
    }
}

/**
 * 매칭 상태 응답 DTO
 */
export class MatchingStatusDto {
    constructor(data) {
        /** @type {string} 매칭 상태 (matching.status) */
        this.status = data.status;
        
        this.currentMembers = {
            total: Number(data.currentMembers.total_members) || 0,
            frontend: Number(data.currentMembers.frontend_count) || 0,
            backend: Number(data.currentMembers.backend_count) || 0
        };
        
        if (data.status === 'completed' && data.teamMembers) {
            /** @type {Object} 매칭 완료시 팀 정보 */
            this.teamInfo = {
                members: data.teamMembers.map(member => new TeamMemberDto(member))
            };
        }
    }
}

/**
 * 팀 게시판 DTO
 */
export class TeamBoardDto {
    constructor(data) {
        /** @type {number} 게시글 ID (posts.id) */
        this.postId = data.postId;
        
        /** @type {number} 팀 ID (posts.team_id) */
        this.teamId = data.teamId;
        
        /** @type {Array<Object>} 댓글 목록 */
        this.comments = data.comments?.map(comment => ({
            /** @type {number} 댓글 ID (comments.id) */
            id: comment.id,
            
            /** @type {string} 작성자 이름 (users.name) */
            authorName: comment.authorName,
            
            /** @type {string} 댓글 내용 (comments.content) */
            content: comment.content,
            
            /** @type {Date} 작성 시간 (comments.created_at) */
            createdAt: comment.createdAt
        })) || [];
    }
}

/**
 * 매칭 결과 응답 DTO
 */
export class MatchingResponseDto {
    constructor(success, message, data = null) {
        /** @type {boolean} 성공 여부 */
        this.success = success;
        
        /** @type {string} 응답 메시지 */
        this.message = message;
        
        if (data) {
            /** @type {Object} 응답 데이터 */
            this.data = data;
        }
    }
}