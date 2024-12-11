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

// 팀 게시판 댓글 불러오기 요청 DTO
export const teamIdToPosts = (params) =>{
    return{
        teamId:params.teamId
    }
}

//팀 게시판 댓글 불러오기 전송 DTO
export const responseFromAllPosts = (data) =>{
    return{
        content: data
    }
}

// 팀원 프로필 조회 요청 DTO
export const tmToProfile = (data) =>{
    return{
        teamId: data.teamId,
        userId: data.userId
    }
}

//팀원 프로필 조회 전송 DTO
export const responseFromUserProfile = (data) =>{
    const skillList = data.skill.map(item => item.tech_name);

    return{
        name : data.userInfo[0].name,
        email: data.userInfo[0].email,
        skill: skillList,
        position: data.userInfo[0].position
    };
}

