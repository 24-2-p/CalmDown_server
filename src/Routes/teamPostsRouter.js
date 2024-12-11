import express from 'express';
import {handlerTeamPostsAdd} from "../Controllers/teamPostsController.js";

const router = express.Router();


// 팀 게시판 댓글 추가 기능
router.post("/:teamId/users/:userId/posts/write", handlerTeamPostsAdd);




export default router;