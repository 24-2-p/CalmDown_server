import {StatusCodes} from "http-status-codes";
import {teamIdToPosts, tmToProfile, writeToPosts} from "../Dtos/teamDTO.js";
import {teamMemberProfile, teamTalkContentAdd, teamTalkList} from "../Services/teamService.js";

// 팀게시판 댓글 추가기능
export const handlerTeamPostsAdd = async (req, res) => {
    console.log("팀 게시판 댓글추가 기능");

    const team = await teamTalkContentAdd(writeToPosts(req.body,req.params));
    res.status(StatusCodes.OK).success(team);
}

// 팀 게시판 전체 댓글 불러오기
export const handlerTeamPosts = async (req, res) => {
    console.log("팀 게시판 댓글 불러오기")

    const talkList = await teamTalkList(teamIdToPosts(req.params));
    res.status(StatusCodes.OK).success(talkList);
}

// 팀원 프로필 조회
export const handlerTMProfile = async (req, res) => {
    console.log("팀원 프로필 조회");

    const profile = await teamMemberProfile(tmToProfile(req.params));
    console.log(profile)
    res.status(StatusCodes.OK).success(profile);
}