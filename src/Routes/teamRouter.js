import express from 'express';
import {
    handlerTeamPosts,
    handlerTeamPostsAdd,
    handlerteamPostsDel,
    handlerTMProfile
} from "../Controllers/teamController.js";

const router = express.Router();


// 팀 게시판 댓글 추가 기능
router.post("/:teamId/users/:userId/posts/:postsId/write", handlerTeamPostsAdd);

//팀 게시판 대화내용 전체 조회
router.get("/:teamId/posts/:postsId", handlerTeamPosts);

// 팀원 프로필 조회 기능
router.get("/:teamId/users/:userId/profile", handlerTMProfile);

//팀 게시판 대화내용 삭제
router.delete("/:teamId/posts/:postsId/comments/:commentsId/del", handlerteamPostsDel);

/**********스웨거*************/
//팀 게시판 댓글 추가기능
/**
 * @swagger
 * /teams/{teamId}/users/{userId}/posts/{postsId}/write:
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
 *       - in: path
 *         name: postsId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 팀 게시판 ID
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

// 팀 게시판 대화내용 전체 조회
/**
 * @swagger
 * /teams/{teamId}/posts/{postsId}:
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
 *       - in: path
 *         name: postsId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 팀 게시판 ID
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
 *                           content:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 */

//팀원 프로필 조회 기능
/**
 * @swagger
 * /teams/{teamId}/users/{userId}/profile:
 *   get:
 *     summary: 팀원 프로필 조회 API
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
 *         description: 유저 ID
 *     responses:
 *       200:
 *         description: 팀원 프로필 조회 성공
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
 *                      name:
 *                          type: string
 *                      email:
 *                          type: string
 *                      skill:
 *                          type: array
 *                          items:
 *                              type: string
 *                      position:
 *                          type: string
 */

//팀 게시판 대화내용 삭제
/**
 * @swagger
 * /teams/{teamId}/posts/{postsId}/comments/{commentId}/del:
 *   delete:
 *     summary: 팀 게시판 댓글 삭제 API
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 팀 ID
 *       - in: path
 *         name: postsId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 팀 게시판 ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 댓글 ID
 *     responses:
 *       200:
 *         description: 댓글 삭제 성공(삭제된 데이터)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: null
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: 안녕하세요
 */


/**********스웨거*************/



export default router;