import cors, { CorsOptions } from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import cookieParser from 'cookie-parser';
import { CLIENT_URL } from './constants/common';

const app: Application = express();

// const corsOptions: CorsOptions = {
//   origin: 'http://localhost:3000/'  /* [CLIENT_URL, "http://localhost:3000/"] */,
//   credentials: true,
// };

const corsOptions: CorsOptions = {
  origin: [CLIENT_URL, 'http://localhost:3000/'],
  methods: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/v1', routes);

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
