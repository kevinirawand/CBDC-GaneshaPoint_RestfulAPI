import { Request, Response } from 'express';
import db from '../../models';
import AuthUtils from '../../utils/auth-utils';
import BaseError from '../../base_claseses/base-error';
import statusCodes from '../../errors/status-codes';
import { DUPLICATE_FOUND, INVALID_CREDENTIALS } from '../../errors/error-codes';

class AuthController {
   public register = async (req: Request, res: Response): Promise<Response> => {
      const user = await db.User.findOne({
         where: {
            email: req.body.email,
         },
      });

      if (user) {
         throw new BaseError(
            400,
            statusCodes.DUPLICATE.message,
            'Email Already Exists',
         );
      }

      const hashPassword: string = await AuthUtils.hash(req.body.password);

      try {
         await db.sequelize.transaction(
            async (transactionData: any): Promise<any> => {
               const user = await db.User.create(
                  {
                     nama: req.body.nama,
                     no_hp: req.body.no_hp,
                     phone_number: req.body.phone_number,
                     email: req.body.email,
                     password: hashPassword,
                  },
                  {
                     transaction: transactionData,
                  },
               );

               await db.Wallet.create(
                  {
                     user_id: user.id,
                  },
                  {
                     transaction: transactionData,
                  },
               );
            },
         );

         return res.status(200).json({
            code: 200,
            status: 'OK',
            data: {
               message: 'Register Success!',
            },
         });
      } catch (error: any) {
         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            error!.message.toString(),
         );
      }
   };

   public login = async (req: Request, res: Response): Promise<Response> => {
      const user = await db.User.findOne({
         where: {
            email: req.body.email,
         },
      });

      const match: boolean =
         user &&
         (await AuthUtils.passwordCompare(req.body.password, user.password));

      if (!user || !match) {
         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            'Incorect email or password',
         );
      }

      let accessToken: string = AuthUtils.generateToken(user.id, user.role);

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            user_id: user.id,
            accessToken: accessToken,
            refreshToken: 'THIS_REFRESH_TOKEN',
         },
      });
   };
}

export default new AuthController();
