import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import accountRouter from './routes/accounts.routes';

const app = express();
app.use(express.json());
dotenv.config();

// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.requestTime = new Date().toISOString();
// });

app.get('/', (req: Request, res: Response) => {
  return res.send({
    data: 'hello world',
  });
});

console.log(process.env.DATABASE_URL);

app.listen(3000, () => {
  console.log('listening on port 3000...');
});
