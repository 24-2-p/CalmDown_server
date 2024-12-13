// matchingService.js
import { pool } from '../db.config.js';
import matchingRepository from '../Repositories/matchingRepository.js';
import { MatchingStatusDto, TeamMemberDto, MatchingResponseDto } from '../Dtos/matchingDto.js';

// Repositories/matchingRepository.js


class MatchingRepository {
    // 진행 중인 매칭이 있는지 확인하는 메서드
    // projectId와 userId를 기반으로 이미 매칭에 참여 중인지 체크
    async checkExistingMatching(projectId, userId, connection) {
        const [result] = await connection.query(`
            SELECT m.id 
            FROM MATCHING m 
            WHERE m.project_id = ? 
            AND m.status = 'waiting'
            AND (
                m.representative_id = ?
                OR EXISTS (
                    SELECT 1 
                    FROM TEAMS t 
                    JOIN TEAM_MEMBERS tm ON t.id = tm.team_id 
                    WHERE t.matching_id = m.id AND tm.user_id = ?
                )
            )`,
            [projectId, userId, userId]
        );
        return result;
    }

    // 새로운 매칭 정보를 생성하는 메서드
    async createMatching(userId, projectId, matchingType, connection) {
        const [result] = await connection.query(
            `INSERT INTO MATCHING 
             (representative_id, project_id, matching_type, status)
             VALUES (?, ?, ?, 'waiting')`,
            [userId, projectId, matchingType]
        );
        return result.insertId;
    }

    // 새로운 팀을 생성하는 메서드
    async createTeam(matchingId, connection) {
        const [result] = await connection.query(
            'INSERT INTO TEAMS (matching_id) VALUES (?)',
            [matchingId]
        );
        return result.insertId;
    }

    // 팀에 새로운 멤버를 추가하는 메서드
    async addTeamMember(teamId, userId, connection) {
        await connection.query(
            'INSERT INTO TEAM_MEMBERS (team_id, user_id) VALUES (?, ?)',
            [teamId, userId]
        );
    }

    // 사용자의 기술 스택을 업데이트하는 메서드
    async updateUserTechStacks(userId, techStacks, connection) {
        // 기존 기술스택 삭제
        await connection.query(
            'DELETE FROM USER_TECH_STACKS WHERE user_id = ?',
            [userId]
        );

        // 새로운 기술스택 추가
        if (techStacks.length > 0) {
            const values = techStacks.map(tech => [userId, tech]);
            await connection.query(
                'INSERT INTO USER_TECH_STACKS (user_id, tech_name) VALUES ?',
                [values]
            );
        }
    }

    // 특정 팀의 매칭 상태를 조회하는 메서드
    async getMatchingStatus(teamId) {
        const [result] = await pool.query(`
            SELECT 
                m.status,
                m.id as matching_id,
                COUNT(DISTINCT tm.id) as total_members,
                SUM(CASE WHEN u.position = 'frontend' THEN 1 ELSE 0 END) as frontend_count,
                SUM(CASE WHEN u.position = 'backend' THEN 1 ELSE 0 END) as backend_count
            FROM TEAMS t
            JOIN MATCHING m ON t.matching_id = m.id
            JOIN TEAM_MEMBERS tm ON t.id = tm.team_id
            JOIN USERS u ON tm.user_id = u.id
            WHERE t.id = ?
            GROUP BY t.id, m.status, m.id`,
            [teamId]
        );
        return result[0];
    }

    // 팀 멤버들의 정보를 조회하는 메서드
    async getTeamMembers(teamId) {
        const [members] = await pool.query(`
            SELECT 
                u.name,
                u.position,
                u.portfolio,
                GROUP_CONCAT(uts.tech_name) as tech_stacks
            FROM TEAM_MEMBERS tm
            JOIN USERS u ON tm.user_id = u.id
            LEFT JOIN USER_TECH_STACKS uts ON u.id = uts.user_id
            WHERE tm.team_id = ?
            GROUP BY u.id, u.name, u.position, u.portfolio`,
            [teamId]
        );
        return members.map(m => ({
            ...m,
            tech_stacks: m.tech_stacks ? m.tech_stacks.split(',') : []
        }));
    }

    // 매칭 상태를 업데이트하는 메서드
    async updateMatchingStatus(matchingId, status, connection) {
        await connection.query(
            'UPDATE MATCHING SET status = ? WHERE id = ?',
            [status, matchingId]
        );
    }

    // 팀 게시판을 생성하는 메서드
    async createTeamBoard(teamId, connection) {
         // 팀의 가장 낮은 user_id를 가진 멤버를 찾아 대표자로 설정
    const [teamLeader] = await connection.query(`
        SELECT MIN(user_id) as representative_id
        FROM TEAM_MEMBERS
        WHERE team_id = ?`,
        [teamId]
    );

    // 팀 게시판 생성 (한 팀당 하나의 게시판)
    await connection.query(
        'INSERT INTO POSTS (team_id, user_id) VALUES (?, ?)',
        [teamId, teamLeader[0].representative_id]
    );
}

    // 매칭을 취소하는 메서드
    async cancelMatching(teamId, connection) {
         // 팀 정보 조회
    const [teamInfo] = await connection.query(
        'SELECT matching_id FROM TEAMS WHERE id = ?',
        [teamId]
    );

    if (!teamInfo[0]) {
        throw new Error('해당 팀을 찾을 수 없습니다.');
    }

    // 팀 멤버 삭제
    await connection.query(
        'DELETE FROM TEAM_MEMBERS WHERE team_id = ?',
        [teamId]
    );

    // 팀 삭제
    await connection.query(
        'DELETE FROM TEAMS WHERE id = ?',
        [teamId]
    );

    // 매칭 삭제
    await connection.query(
        'DELETE FROM MATCHING WHERE id = ?',
        [teamInfo[0].matching_id]
    );
}
    // matchingRepository.js에 추가
    async getTeamStatus(teamId) {
        const [result] = await pool.query(`
        SELECT 
            m.status,
            m.id as matching_id,
            COUNT(DISTINCT tm.user_id) as total_members,
            SUM(CASE WHEN u.position = 'frontend' THEN 1 ELSE 0 END) as frontend_count,
            SUM(CASE WHEN u.position = 'backend' THEN 1 ELSE 0 END) as backend_count
        FROM TEAMS t
        JOIN MATCHING m ON t.matching_id = m.id
        JOIN TEAM_MEMBERS tm ON t.id = tm.team_id
        JOIN USERS u ON tm.user_id = u.id
        WHERE t.id = ?
        GROUP BY m.id, m.status`,
            [teamId]
        );
        return result[0];
    }
    // matchingRepository.js에 추가할 메서드
    async findAvailableTeam(position, connection) {
        // 4명 미만의 팀만 선택
        // 현재 포지션이 들어갔을 때 front 1, back 2 조건을 만족할 수 있는 팀을 찾음
        // 조건을 만족할 수 있는 팀이 여러 개면 인원이 많은 팀 우선
        const [teams] = await connection.query(`
         SELECT 
            t.id as team_id,
            COUNT(DISTINCT tm.user_id) as member_count,
            SUM(CASE WHEN u.position = 'frontend' THEN 1 ELSE 0 END) as frontend_count,
            SUM(CASE WHEN u.position = 'backend' THEN 1 ELSE 0 END) as backend_count
        FROM TEAMS t
        JOIN MATCHING m ON t.matching_id = m.id
        JOIN TEAM_MEMBERS tm ON t.id = tm.team_id
        JOIN USERS u ON tm.user_id = u.id
        WHERE m.status = 'waiting'
        GROUP BY t.id
        HAVING 
            member_count < 4 AND
            (
                -- 현재 포지션이 들어갔을 때 조건을 만족할 수 있는 경우만 선택
                (member_count = 3 AND 
                    CASE 
                        WHEN frontend_count = 0 AND '${position}' = 'frontend' THEN true
                        WHEN backend_count < 2 AND '${position}' = 'backend' THEN true
                        WHEN frontend_count >= 1 AND backend_count >= 2 THEN true
                        ELSE false
                    END
                )
                OR member_count < 3
            )
        ORDER BY member_count DESC
        LIMIT 1`
        );
        return teams[0];
    }
    async updateTeamMatchingStatus(teamId, status, connection) {
        // 해당 팀의 모든 멤버의 매칭 상태를 업데이트
        await connection.query(`
         UPDATE MATCHING m
            JOIN (
                SELECT DISTINCT m2.id
                FROM MATCHING m2
                JOIN TEAMS t ON m2.representative_id IN (
                    SELECT user_id 
                    FROM TEAM_MEMBERS 
                    WHERE team_id = ?
                )
            ) matched ON matched.id = m.id
            SET m.status = 'completed'`,
            [teamId]
        );
    }
}

export default new MatchingRepository();

// 사용자 이메일 유효성 검사
export const checkUser = async (data)=>{
    const conn = await pool.getConnection();

    try{
        const [result] = await conn.query(
            `select email from USERS where email = '${data.email}';`
        );
        let check = false

        if(result.length){
            check = true;
        }
        return {result, check};
    }catch (err){
        throw new Error(`오류 발생 파라미터 확인바람 (${err})`)
    }finally {
        conn.release();
    }
}