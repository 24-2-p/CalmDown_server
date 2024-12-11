import {responseFromAllPosts, responseFromPosts} from "../Dtos/teamDTO.js";
import {addTalk, getCommentsInfo, getTalkList} from "../Repositories/teamRepository.js";
import {TeamNotFoundError} from "../errors.js";


// 팀 게시판 대화 등록
export const teamTalkContentAdd = async (data) => {

    const commentsId  = await addTalk({
        teamId : data.teamId,
        userId : data.userId,
        content: data.content
    });

    if(commentsId === null){
        throw new TeamNotFoundError('존재하지 않는 팀입니다.', data)
    }

    const [content] = await getCommentsInfo(commentsId);
    return responseFromPosts(content);
}

// 팀 게시판 댓글 불러오기
export const teamTalkList = async (data) => {
    const talkList = await getTalkList(data.teamId);

    return responseFromAllPosts(talkList);
}