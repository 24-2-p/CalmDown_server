// 팀 게시판 대화내용 등록 DTO
export const writeToPosts = (body, params) =>{
    return{
        teamId: params.teamId,
        userId: params.userId,
        content: body.content,
    }
}

// 팀 게시판 대화내용 등록 완료 전송
export const responseFromPosts = (data) =>{
    return{
        content: data.content,
        userId: data.user_id,
        createdAt: data.created_at,
    }
}