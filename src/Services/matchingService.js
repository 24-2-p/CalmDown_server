// matchingService.js
import { pool } from '../db.config.js';
import matchingRepository from '../Repositories/matchingRepository.js';
import { MatchingStatusDto, TeamMemberDto, MatchingResponseDto } from '../Dtos/matchingDto.js';

class MatchingService {
    async startMatching(matchingDto) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 필수 입력값 검증
            if (!matchingDto.position || !matchingDto.portfolio || !matchingDto.techStacks.length) {
                throw new Error('포지션, 포트폴리오, 기술스택은 필수 입력값입니다.');
            }

            // 포지션 유효성 검사
            if (!['frontend', 'backend', 'ai', 'iot'].includes(matchingDto.position)) {
                throw new Error('올바르지 않은 포지션입니다.');
            }

            // 사용자 정보 갱신 (position과 portfolio를 새로운 값으로 업데이트)
            await connection.query(
                'UPDATE USERS SET position = ?, portfolio = ? WHERE id = ?',
                [matchingDto.position, matchingDto.portfolio, matchingDto.userId]
            );

            // 기술스택 전체 갱신
            await connection.query(
                'DELETE FROM USER_TECH_STACKS WHERE user_id = ?',
                [matchingDto.userId]
            );

            if (matchingDto.techStacks.length > 0) {
                const techStackValues = matchingDto.techStacks.map(tech => [matchingDto.userId, tech]);
                await connection.query(
                    'INSERT INTO USER_TECH_STACKS (user_id, tech_name) VALUES ?',
                    [techStackValues]
                );
            }

            // 매칭 시작 로직
            let teamId;
            // 대표자의 매칭 정보 먼저 생성
            const mainMatchingId = await matchingRepository.createMatching(
                matchingDto.userId,
                matchingDto.projectId,
                matchingDto.teamEmails.length > 0 ? 'team' : 'single',
                connection
            );

            if (matchingDto.teamEmails.length > 0) {
                // 팀원과 함께 매칭하는 경우
                // 각 팀원의 매칭 정보 생성
                for (const email of matchingDto.teamEmails) {
                    const [user] = await connection.query(
                        'SELECT id, position FROM USERS WHERE email = ?',
                        [email]
                    );

                    if (!user[0]) {
                        throw new Error(`존재하지 않는 이메일입니다: ${email}`);
                    }
                    if (!user[0].position) {
                        throw new Error(`포지션이 설정되지 않은 사용자입니다: ${email}`);
                    }

                    // 팀원의 매칭 정보 생성
                    await matchingRepository.createMatching(
                        user[0].id,
                        matchingDto.projectId,
                        'team',
                        connection
                    );
                }

                // 팀 생성 및 멤버 추가
                teamId = await matchingRepository.createTeam(mainMatchingId, connection);
                await matchingRepository.addTeamMember(teamId, matchingDto.userId, connection);

                // 팀원들을 팀에 추가
                for (const email of matchingDto.teamEmails) {
                    const [user] = await connection.query(
                        'SELECT id FROM USERS WHERE email = ?',
                        [email]
                    );
                    await matchingRepository.addTeamMember(teamId, user[0].id, connection);
                }
            } else {
                // 단독 매칭의 경우
                const availableTeam = await matchingRepository.findAvailableTeam(
                    matchingDto.position,
                    connection
                );

                if (availableTeam) {
                    // 기존 팀에 합류
                    teamId = availableTeam.team_id;
                    await matchingRepository.addTeamMember(teamId, matchingDto.userId, connection);
                } else {
                    // 새로운 팀 생성
                    teamId = await matchingRepository.createTeam(mainMatchingId, connection);
                    await matchingRepository.addTeamMember(teamId, matchingDto.userId, connection);
                }
            }

            await connection.commit();
            return new MatchingResponseDto(true, "매칭이 시작되었습니다.", { teamId });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }


    async getMatchingStatus(teamId) {
        // 팀 상태 조회
        const status = await matchingRepository.getTeamStatus(teamId);
        if (!status) {
            throw new Error('팀을 찾을 수 없습니다.');
        }
        console.log('DB 쿼리 결과:', status); // 디버깅을 위한 로그 추가

        const response = {
            status: status.status,
            currentMembers: {

                total_members: Number(status.total_members),
                frontend_count: Number(status.frontend_count),
                backend_count: Number(status.backend_count)
            }
        };
        console.log('Service response:', response);  // 서비스에서 가공한 데이터


        // 매칭 완료 조건 확인
        if (status.status === 'waiting' &&
            status.total_members === 4 &&
            status.frontend_count >= 1 &&
            status.backend_count >= 2) {

            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();

                // 팀의 모든 멤버의 매칭 상태를 completed로 변경
                await matchingRepository.updateTeamMatchingStatus(teamId, 'completed', connection);

                // 팀 게시판 생성
                await matchingRepository.createTeamBoard(teamId, connection);

                await connection.commit();
                status.status = 'completed';
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        }



        // 매칭 완료된 경우 팀원 정보 포함
        if (status.status === 'completed') {
            const members = await matchingRepository.getTeamMembers(teamId);
            response.teamInfo = {
                members: members.map(m => new TeamMemberDto(m))
            };
        }

        return new MatchingStatusDto(response);
    }

    async cancelMatching(teamId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 매칭 취소 전에 현재 상태 확인
            const status = await matchingRepository.getTeamStatus(teamId);
            if (!status) {
                throw new Error('팀을 찾을 수 없습니다.');
            }
            if (status.status === 'completed') {
                throw new Error('이미 완료된 매칭은 취소할 수 없습니다.');
            }

            await matchingRepository.cancelMatching(teamId, connection);

            await connection.commit();
            return new MatchingResponseDto(true, "매칭이 취소되었습니다.");
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default new MatchingService();