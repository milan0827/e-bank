import { NextFunction, Request, Response, response } from 'express';
import app from './app';

app.listen(3000, () => {
  console.log('listening on port 3000...');
});
