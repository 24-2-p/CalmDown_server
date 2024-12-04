import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from 'swagger-ui-express';

import userRouter from './routes/userRouter.js';

dotenv.config();

// const express = require('express');
// const cors = require('cors');
// const userRoutes = require('./Routes/userRouter');
// require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static('public')); // 정적파일 접근
app.use(express.json()); // 요청의 본문 json으로 해석
app.use(express.urlencoded({ extended: true })); //단순 객체 문자열 형태로 본문 데이터 해석

app.use('/users', userRouter);

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
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
