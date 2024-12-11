import {StatusCodes} from "http-status-codes";
import { writeToPosts} from "../Dtos/teamDTO.js";
import {teamTalkContentAdd} from "../Services/teamService.js";

// 팀게시판 댓글 추가기능
export const handlerTeamPostsAdd = async (req, res) => {
    console.log("팀 게시판 댓글추가 기능");

    const team = await teamTalkContentAdd(writeToPosts(req.body,req.params));
    res.status(StatusCodes.OK).success(team);
    /*
        #swagger.summary = '팀 게시판 댓글 추가 API';
        #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                    content : {type: "string"}
                }
              }
            }
          }
        };
        #swagger.responses[200] = {
          description: "댓글 추가 성공 응답",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  resultType: { type: "string", example: "SUCCESS" },
                  error: { type: "object", nullable: true, example: null },
                  success: {
                    type: "object",
                    properties: {
                        content : {type: "string"},
                        userId : {type: "number"},
                        createAt: {type : "date"}
                    }
                  }
                }
              }
            }
          }
        };
        #swagger.responses[400] = {
          description: "댓글 추가 실패 응답",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  resultType: { type: "string", example: "FAIL" },
                  error: {
                    type: "object",
                    properties: {
                      errorCode: { type: "string", example: "T001" },
                      reason: { type: "string" },
                      data: { type: "object" }
                    }
                  },
                  success: { type: "object", nullable: true, example: null }
                }
              }
            }
          }
        };
      */

}