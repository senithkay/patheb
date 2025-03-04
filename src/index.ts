import express from 'express'
import authRoute from "./routes/authRoute";
import authorize from "./middlewares/authMiddleware";
import cookieParser from 'cookie-parser'
import userRoute from "./routes/userRoute";
import cors from 'cors'
import {startup} from "./utils/startup";
import courseRoute from "./routes/courseRoute";

startup()
const app = express();

app.use(cors({
    origin: true,
    credentials: true,
}))
app.get('/test', (req,res)=>{
    res.send('Back status: running')
})
app.use(cookieParser());
app.use(express.json({ limit: '25mb' }));
app.use(authorize);
app.use(express.static('src/public/'))
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/course', courseRoute);

app.listen(process.env.PORT || 8080,
    () => {
        console.log(`[INFO] Server started on http://localhost:${process.env.PORT}`);
    }
);

