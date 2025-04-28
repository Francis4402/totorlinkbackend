import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response  } from "express";
import cors from 'cors';
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";



const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({origin: ['http://localhost:3000'], credentials: true}));

app.get('/', (req, res) => {
    res.send('TutorLink');
})

app.use('/api', router);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    globalErrorHandler(error, req, res, next);
});
  
  //Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
    notFound(req, res, next);
});


export default app;