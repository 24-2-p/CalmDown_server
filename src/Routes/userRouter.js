// src/Routes/userRouter.js
import express from 'express';
import {
    signup,
    login,
    handlerMyProfileInfo,
    handlerMyInfoModify
} from '../Controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: 회원가입 API
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "홍길동"
 *     responses:
 *       201:
 *         description: 회원가입 성공
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
 *                   example: "회원가입이 완료되었습니다"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "test@example.com"
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
 *                   example: "이미 존재하는 이메일입니다"
 */
router.post('/signup', signup);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: 로그인 API
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       401:
 *         description: 인증 실패
 */
router.post('/login', login);

//나의 정보 출력 기능
router.get('/:userId/profile',handlerMyProfileInfo);
/**
 * @swagger
 * /users/{userId}/profile:
 *   get:
 *     summary: 나의 프로필 조회 API
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 유저 ID
 *     responses:
 *       200:
 *         description: 프로필 조회 성공
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

//나의 역할군 수정 기능
router.patch('/:userId/modify', handlerMyInfoModify);
/**
 * @swagger
 * /users/{userId}/modify:
 *   patch:
 *     summary: 사용자 프로필 수정 API
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 유저 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: string
 *               skill:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultType:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 success:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     skill:
 *                       type: array
 *                       items:
 *                         type: string
 *                     position:
 *                       type: string
 */



export default router;
