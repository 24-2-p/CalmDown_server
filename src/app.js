import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from 'swagger-ui-express';
import userRouter from './Routes/userRouter.js';
import { testConnection } from './db.config.js' ;
import teamPostsRouter from './Routes/teamPostsRouter.js';
dotenv.config();


// const cors = require('cors');
// const userRoutes = require('./Routes/userRouter');
// require('dotenv').config();

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
app.use('/teams', teamPostsRouter);



/****************스웨거 설정 *************/
 app.use(
     "/docs",
     swaggerUiExpress.serve,
     swaggerUiExpress.setup({}, {
         swaggerOptions: {
             url: "/openapi.json",
         },
     })
 );
 app.get("/openapi.json", async (req, res, next) => {
     // #swagger.ignore = true
     const options = {
         openapi: "3.0.0",
         disableLogs: true,
         writeOutputFile: false,
     };

    
     const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
     const routes = ["./src/app.js"];
     const doc = {
         info: {
             title: "캄다운 팀매칭 서비스",
             description: "캄다운 프로젝트 팀원 매칭 서비스",
         },
         host: "localhost:3000",
     };

     const result = await swaggerAutogen(options)(outputFile, routes, doc);
     res.json(result ? result.data : null);
 });
 /****************스웨거 설정 *************/


app.get('/', (req, res) => {
    // #swagger.ignore = true
    res.send('Hello World!')
})

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
app.listen(port,async () => {
    console.log(`Example app listening on port ${port}`);

    await testConnection();
})

export default app;