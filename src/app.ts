import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { globalErrorHandling } from './controller/errors/errors.controller';
import { trimmer } from './middleware/trimmerMiddleware';
import accountRouter from './routes/accounts.routes';
import authRouter from './routes/auth.routes';
import entriesRouter from './routes/entries.routes';
import transferRouter from './routes/transfers.routes';
import usersRouter from './routes/users.routes';
import { CustomErrorType } from './types/customErrorType';
import morganMiddleware from './middleware/morganMiddleware';

const app = express();
app.use(express.json());
dotenv.config();

console.log('Process', process.env.NODE_ENV);

app.use(morganMiddleware);
app.use(trimmer);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/entries', entriesRouter);
app.use('/api/v1/transfers', transferRouter);
app.use('/api/v1/users', usersRouter);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(
    res.status(404).json({
      status: 'fail',
      message: `The requested url ${req.originalUrl} does not exist`,
    }),
  );
});

app.use((err: CustomErrorType, req: Request, res: Response, next: NextFunction) => {
  globalErrorHandling(err, req, res);
});

export default app;
