import { Request, Response, NextFunction } from 'express';
import { Schema, z, ZodError } from 'zod';

export const validateData = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res.status(400).json({
          status: 'fail',
          error: errorMessages,
        });
      } else {
        res.status(500).json({
          status: 'fail',
          error: 'internal server error',
        });
      }
    }
  };
};
