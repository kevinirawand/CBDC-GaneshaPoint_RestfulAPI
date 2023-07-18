import { Request, Response, NextFunction } from 'express';
import BaseError from '../base_claseses/base-error';
import StatusCodes from '../errors/status-codes';
import logger from '../utils/logger';
import { INVALID_CREDENTIALS, SERVER_PROBLEM } from '../errors/error-codes';

const errorHandler = (
   err: any,
   _req: Request,
   res: Response,
   _next: NextFunction,
) => {
   const statusCode: any = Object.values(StatusCodes).find(
      (code: any) => code.message === err.statusCode,
   );

   if (err.name === 'ValidationError') {
      const errorObj: any = {};

      for (const error of err.details) {
         errorObj[error.path] = [error.message];
      }

      return res.status(StatusCodes.BAD_REQUEST.code).json({
         code: INVALID_CREDENTIALS,
         status: StatusCodes.BAD_REQUEST.message,
         errors: errorObj,
      });
   }

   if (err.name == 'SequelizeValidationError') {
      return res.status(400).json(err);
   }

   if (err instanceof BaseError) {
      console.error(err);
      return res.status(statusCode.code).json({
         code: err.errorCode,
         status: err.statusCode,
         errors: {
            message: err.message,
         },
      });
   }

   return res.status(StatusCodes.INTERNAL_SERVER.code).json({
      code: SERVER_PROBLEM,
      status: StatusCodes.INTERNAL_SERVER.message,
      errors: {
         message: err.message,
      },
   });
};

export default errorHandler;
