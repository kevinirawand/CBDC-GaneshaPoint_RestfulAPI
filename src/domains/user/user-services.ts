import { NULL_DATA } from '../../errors/error-codes';
import BaseError from '../../base_claseses/base-error';
import statusCodes from '../../errors/status-codes';
import db from '../../models';
import AuthUtils from '../../utils/auth-utils';

class UserServices {
   public getAll = async (): Promise<any> => {
      const users = await db.User.findAll({
         include: [
            {
               model: db.Wallet,
               as: 'wallet',
               attributes: {
                  exclude: ['createdAt', 'updatedAt'],
               },
            },
         ],
         attributes: {
            exclude: ['password', 'createdAt', 'updatedAt', 'wallet_id'],
         },
      });

      return users;
   };

   public updatePassword = async (
      userId: number,
      oldPassword: string,
      newPassword: string,
   ): Promise<void> => {
      const user = await db.User.findOne({
         where: {
            id: userId,
         },
      });
      console.info(user.password);

      const match: boolean = await AuthUtils.passwordCompare(
         oldPassword,
         user.password,
      );

      if (!match) {
         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            'Incorect old password',
         );
      }

      const hashPassword: string = await AuthUtils.hash(newPassword);

      await user.update({
         password: hashPassword,
      });
   };

   public findById = async (user_id: number): Promise<any> => {
      const user = await db.User.findOne({
         where: {
            id: user_id,
         },
         include: [
            {
               model: db.Wallet,
               as: 'wallet',
               attributes: {
                  exclude: ['createdAt', 'updatedAt'],
               },
            },
         ],
         attributes: { exclude: ['password', 'wallet_id', 'updatedAt'] },
      });

      if (user === null) {
         throw new BaseError(
            400,
            statusCodes.NOT_FOUND.message,
            'User Not Found',
         );
      }

      return user;
   };

   public update = async (user_id: number, data: any): Promise<any> => {
      const user = await db.User.findOne({
         where: {
            id: user_id,
         },
      });

      if (!user) {
         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            'User Does not exist',
         );
      }
      await user.update(data);
   };

   public delete = async (user_id: number): Promise<any> => {
      const user = await db.User.findOne({
         where: {
            id: user_id,
         },
      });

      if (!user) {
         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            'User Does not exist',
         );
      }

      await db.User.destroy({
         where: {
            id: user_id,
         },
      });
   };
}

export default new UserServices();
