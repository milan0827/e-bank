import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { globalErrorHandling } from './controller/errors.controller';
import accountRouter from './routes/accounts.routes';
import entriesRouter from './routes/entries.routes';
import transferRouter from './routes/transfers.routes';
import { CustomErrorType } from './types/customErrorType';

const app = express();
app.use(express.json());
dotenv.config();

// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.requestTime = new Date().toISOString();
// });

// app.get('/', (req: Request, res: Response) => {
//   return res.send({
//     data: 'hello world',
//   });
// });

app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/entries', entriesRouter);
app.use('/api/v1/transfers', transferRouter);

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
