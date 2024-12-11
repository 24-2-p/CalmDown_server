import {pool} from "../db.config.js";

// 팀 게시판 대화내용 등록 기능
export const addTalk = async (data) =>{
    const conn = await pool.getConnection();

    try{
        // 해당 팀이 존재하는지 확인
        const [confirm] = await pool.query(
            `select * from teams where id = ${data.teamId} ;`
        )
        if(confirm.length === 0){
            return null;
        }

        //게시물 테이블에 등록
        const [result] = await pool.query(
            `insert into posts(team_id,user_id) values( ?, ?);`,
            [data.teamId, data.userId]
        );

        const postsId = result.insertId;

        // 댓글 테이블에 등록
        const [result2] = await pool.query(
            `insert into comments(post_id,user_id,content) values(?,?,?);`,
            [postsId, data.userId, data.content]
        );

        const commentsId = result2.insertId;

        return commentsId;

    }catch(err){
        throw new Error(
            `오류발생함 파라미터 확인 (${err})`
        );
    }finally {
        conn.release();
    }
}

// 코멘트 아이디를 통해서 코멘트 정보 가져오기 (댓글 단것 반환할때 사용)
export const getCommentsInfo = async(commentsId)=>{
    const conn = await pool.getConnection();

    try{
        const [comment] = await conn.query(
            `select * from comments where id= ${commentsId}`
        );

        return comment;
    }catch(err){
        throw new Error(`오류 발생함 파라미터 확인바람 (${err})`)
    }finally {
        conn.release();
    }
}


// 팀 게시판 댓글 목록 반환
export const getTalkList = async(teamId)=>{
    const conn = await pool.getConnection();

    try{
        const [results] = await conn.query(
            `select 
                u.name as name, 
                c.content as content,
                c.created_at as created_at
            from
                comments c
            join posts p
            on c.post_id = p.id
            join users u
            on c.user_id = u.id
            where p.team_id = ${teamId};`
        )

        return results;
    }catch (err){
        throw new Error(`오류 발생함 파라미터 확인바람 (${err})`)
    }finally {
        conn.release();
    }
}