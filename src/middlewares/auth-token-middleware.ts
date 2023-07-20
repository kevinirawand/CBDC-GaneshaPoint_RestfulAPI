import { Request, Response, NextFunction } from 'express';
import statusCodes from '../errors/status-codes';
import BaseError from '../base_claseses/base-error';
import jwt from 'jsonwebtoken';

const authToken = (req: Request, res: Response, next: NextFunction): any => {
   const authHeader: string | undefined = req.get('X-Auth');

   const token: string | undefined = authHeader && authHeader.split(' ')[1];

   if (token == null)
      throw new BaseError(
         401,
         statusCodes.UNAUTHORIZE.message,
         'User Have Not Login',
      );

   jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY || '',
      (err, user: any) => {
         if (err) {
            if (err.message == 'invalid signature') {
               throw new BaseError(
                  403,
                  statusCodes.FORBIDDEN.message,
                  'Invalid Signature',
               );
            } else if (user.isValid === false) {
               throw new BaseError(
                  403,
                  statusCodes.FORBIDDEN.message,
                  'Token Is Invalid Or No Longer Valid',
               );
            } else {
               throw new BaseError(
                  403,
                  statusCodes.FORBIDDEN.message,
                  'Token Is Invalid Or No Longer Valid',
               );
            }
         }

         req.app.locals.user = user;

         return next();
      },
   );
};

export default authToken;
