import express from 'express';
import {handlerTeamPosts, handlerTeamPostsAdd} from "../Controllers/teamPostsController.js";

const router = express.Router();


// 팀 게시판 댓글 추가 기능
router.post("/:teamId/users/:userId/posts/write", handlerTeamPostsAdd);

//팀 게시판 대화내용 전체 조회
router.get("/:teamId/posts", handlerTeamPosts);



/**
 * @swagger
 * /teams/{teamId}/users/{userId}/posts/write:
 *   post:
 *     summary: 팀 게시판 댓글 추가 API
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 팀 ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 success:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                     userId:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 댓글 추가 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: FAIL
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: T001
 *                     reason:
 *                       type: string
 *                     data:
 *                       type: object
 */

/**
 * @swagger
 * /teams/{teamId}/posts:
 *   get:
 *     summary: 팀 게시판 댓글 조회 API
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 팀 ID
 *     responses:
 *       200:
 *         description: 댓글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 success:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: 댓글 작성자
 *                           content:
 *                             type: string
 *                             description: 댓글 내용
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: 댓글 작성 시간
 */


export default router;