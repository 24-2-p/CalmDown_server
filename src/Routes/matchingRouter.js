// Routes/matchingRouter.js
import express from 'express';
import matchingController from '../Controllers/matchingController.js';

const router = express.Router();

/**
 * @swagger
 * /matching/start:
 *   post:
 *     summary: 팀 매칭 시작
 *     description: |
 *       프로젝트 선택 후 매칭을 시작합니다.
 *       모든 필수 정보(프로젝트, 포지션, 기술스택, 포트폴리오)가 입력되어야 합니다.
 *       팀원과 함께 매칭하는 경우 팀원들의 이메일을 포함할 수 있습니다.
 *     tags: [Matching]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - projectId
 *               - position
 *               - techStacks
 *               - portfolio
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 매칭 신청자 ID (users 테이블의 id)
 *                 example: 1
 *               projectId:
 *                 type: integer
 *                 description: 선택한 프로젝트 ID (projects 테이블의 id) - 필수 선택
 *                 example: 1
 *               position:
 *                 type: string
 *                 enum: [frontend, backend, ai, iot]
 *                 description: 선택한 포지션 (users 테이블의 position)
 *                 example: "frontend"
 *               techStacks:
 *                 type: array
 *                 description: 선택한 기술 스택 배열 (user_tech_stacks 테이블에 저장)
 *                 items:
 *                   type: string
 *                 example: ["React", "TypeScript"]
 *               portfolio:
 *                 type: string
 *                 description: 포트폴리오 링크 (users 테이블의 portfolio)
 *                 example: "github.com/username"
 *               teamEmails:
 *                 type: array
 *                 description: 함께 매칭할 팀원들의 이메일 (선택사항)
 *                 items:
 *                   type: string
 *                 example: ["teammate1@example.com"]
 *     responses:
 *       201:
 *         description: 매칭 시작 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "매칭이 시작되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     teamId:
 *                       type: integer
 *                       description: 생성된 팀 ID
 *                       example: 1
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "프로젝트 선택은 필수입니다."
 */
router.post('/start', matchingController.startMatching);

/**
 * @swagger
 * /matching/status/{teamId}:
 *   get:
 *     summary: 매칭 상태 확인
 *     tags: [Matching]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 팀 ID
 *     responses:
 *       200:
 *         description: 매칭 상태 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [waiting, completed, cancelled]
 *                 currentMembers:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     frontend:
 *                       type: integer
 *                     backend:
 *                       type: integer
 *                 teamInfo:
 *                   type: object
 *                   description: 매칭 완료 시에만 포함
 *                   properties:
 *                     members:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           position:
 *                             type: string
 *                           portfolio:
 *                             type: string
 *                           techStacks:
 *                             type: array
 *                             items:
 *                               type: string
 */
router.get('/status/:teamId', matchingController.getMatchingStatus);

/**
 * @swagger
 * /matching/cancel/{teamId}:
*   post:
 *     summary: 매칭 취소
 *     tags: [Matching]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 취소할 팀 ID
 *     responses:
 *       200:
 *         description: 매칭 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "매칭이 취소되었습니다."
 */
router.post('/cancel/:teamId', matchingController.cancelMatching);

export default router;