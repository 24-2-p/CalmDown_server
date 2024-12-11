import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from 'swagger-ui-express';
import userRouter from './Routes/userRouter.js';
import { testConnection } from './db.config.js' ;
import teamPostsRouter from './Routes/teamRouter.js';
import swaggerJsdoc from 'swagger-jsdoc';  // 추가해야 할 import
import matchingRouter from './Routes/matchingRouter.js';

dotenv.config();





const app = express();
const port = process.env.PORT || 3000;

/************공통 응답을 사용할 수 있는 헬퍼 함수*****************/
app.use((req,res,next)=>{
    res.success = (success) =>{
        return res.json({
            resultType: "SUCCESS",
            error: null,
            success: success
        });
    };

    res.error = ({ errorCode = "unknown" , reason = null, data = null}) =>{
        return res.json({
            resultType: "FAIL",
            error: {errorCode, reason, data},
            success: null,
        });
    };

    next();
})

/************성공 처리하기 위한 미들웨어*****************/

app.use(cors()); // cors 방식 허용
app.use(express.static('public')); // 정적파일 접근
app.use(express.json()); // 요청의 본문 json으로 해석
app.use(express.urlencoded({ extended: true })); //단순 객체 문자열 형태로 본문 데이터 해석

app.use('/users', userRouter);
app.use('/matching', matchingRouter);
app.use('/teams', teamPostsRouter);

/****************스웨거 설정 *************/
// app.use(
//     "/docs",
//     swaggerUiExpress.serve,
//     swaggerUiExpress.setup(null, {
//         swaggerOptions: {
//             url: "/openapi.json",
//         },
//     })
// );

const serverUrl =  
     process.env.SERVER_ENV === "department"
         ? "http://ceprj.gachon.ac.kr:60002" // 학과 서버
         : "http://localhost:3000"; // 로컬 서버
         console.log("현재 SERVER_ENV 값:", process.env.SERVER_ENV);
         console.log("선택된 serverUrl:", serverUrl);

    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',  // 이 부분이 중요합니다!
            info: {
                title: "캄다운 팀매칭 서비스",
                description: "캄다운 프로젝트 팀원 매칭 서비스",
                version: "1.0.0"
            },
            servers: [
                {
                    url: `${serverUrl}`, // 동적으로 선택된 서버 URL
                description:
                    process.env.SERVER_ENV === "department"
                        ? "학과 서버 (Department Server)"
                        : "로컬 서버 (Local Server)",
                }
            ]
        },
        apis: ['./src/Routes/*.js']  // 라우터 파일들의 경로
    };

// Swagger 스펙 생성
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI 설정
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec, { explorer: true }));

// OpenAPI 스펙을 JSON으로 제공
app.get('/openapi.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
/****************스웨거 설정 *************/


app.get('/', (req, res) => {
    // #swagger.ignore = true
    res.send('Hello World!')
});

// DB 연결 테스트 라우트
app.get('/test-db', async (req, res) => {
    // #swagger.ignore = true
    try {
        await testConnection();
        res.send('DB 연결 테스트가 성공했습니다!');
    } catch (error) {
        res.status(500).send('DB 연결 테스트 실패: ' + error.message);
    }
});

/*********전역 오류 처리하기 위한 미들웨어*********/
app.use((err,req,res,next) =>{
    if(res.headersSent){
        return next(err);
    }
    console.log(err)
    res.status(err.statusCode || 400).error({
        errorCode: err.errorCode || 'unknown',
        reason: err.reson || err.message || null,
        data: err.data || null,
    });
});

/*********전역 오류 처리하기 위한 미들웨어*********/

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);

    await testConnection();
});

export default app;