import {StatusCodes} from "http-status-codes";
import {delToPosts, teamIdToPosts, tmToProfile, writeToPosts} from "../Dtos/teamDTO.js";
import {teamMemberProfile, teamTalkContentAdd, teamTalkDel, teamTalkList} from "../Services/teamService.js";

// 팀게시판 댓글 추가기능
export const handlerTeamPostsAdd = async (req, res) => {
    const team = await teamTalkContentAdd(writeToPosts(req.body,req.params));
    res.status(StatusCodes.OK).success(team);
}

// 팀 게시판 전체 댓글 불러오기
export const handlerTeamPosts = async (req, res) => {
    const talkList = await teamTalkList(teamIdToPosts(req.params));
    res.status(StatusCodes.OK).success(talkList);
}

// 팀원 프로필 조회
export const handlerTMProfile = async (req, res) => {
    const profile = await teamMemberProfile(tmToProfile(req.params));
    res.status(StatusCodes.OK).success(profile);
}

//팀 게시판 삭제
export const handlerteamPostsDel = async (req, res) => {
    const talkDel = await teamTalkDel(delToPosts(req.params));
    res.status(StatusCodes.OK).success(talkDel);
}