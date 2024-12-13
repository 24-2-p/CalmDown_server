// Controllers/matchingController.js
import matchingService, {userCheck} from '../Services/matchingService.js';
import {checkToUser, MatchingRequestDto} from '../Dtos/matchingDto.js';
import {StatusCodes} from "http-status-codes";


class MatchingController {
    // 매칭 시작 요청 처리
    async startMatching(req, res) {
        try {
            // 요청 데이터를 DTO로 변환
            const matchingDto = new MatchingRequestDto(req.body);
            const result = await matchingService.startMatching(matchingDto);
            res.status(201).json(result);
        } catch (error) {
            console.error('Matching start error:', error);
            res.status(400).json({
                success: false,
                message: error.message || '매칭 시작 중 오류가 발생했습니다.'
            });
        }
    }

    // 매칭 상태 확인
    async getMatchingStatus(req, res) {
        try {
            const { teamId } = req.params;
            const status = await matchingService.getMatchingStatus(parseInt(teamId));
            console.log('Controller response:', status);

            res.json(status);
        } catch (error) {
            console.error('Matching status check error:', error);
            res.status(400).json({
                success: false,
                message: error.message || '매칭 상태 확인 중 오류가 발생했습니다.'
            });
        }
    }
    async getStatus(req, res) {
        try {
            const { teamId } = req.params;
            const status = await matchingService.getMatchingStatus(parseInt(teamId));
            
            // 응답 데이터를 명시적으로 구조화
            const response = {
                status: status.status,
                currentMembers: {
                    total: Number(status.total_members),
                    frontend: Number(status.frontend_count),
                    backend: Number(status.backend_count)
                }
            };
            
            console.log('Final response:', response);  // 최종 응답 데이터 확인
            res.json(response);
        } catch (error) {
            console.error('Matching status check error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // 매칭 취소
    async cancelMatching(req, res) {
        try {
            const { teamId } = req.params;
            const result = await matchingService.cancelMatching(parseInt(teamId));
            res.json(result);
        } catch (error) {
            console.error('Matching cancel error:', error);
            res.status(400).json({
                success: false,
                message: error.message || '매칭 취소 중 오류가 발생했습니다.'
            });
        }
    }
}

export default new MatchingController();


//사용자 이메일 유효성 검사
export const handlerUserCheck = async (req, res) => {
    const result = await userCheck(checkToUser(req.body,req.params));
    res.status(StatusCodes.OK).success(result);
}