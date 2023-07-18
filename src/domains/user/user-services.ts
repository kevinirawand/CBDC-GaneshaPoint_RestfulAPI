import { NULL_DATA } from '../../errors/error-codes';
import BaseError from '../../base_claseses/base-error';
import statusCodes from '../../errors/status-codes';
import db from '../../models';

class UserServices {
   public getAll = async (): Promise<any> => {
      const users = await db.User.findAll();

      return users;
   };

   // use register service
   // public create = async (data: any): Promise<void> => {
   //    await db.User.create(data);
   // };

   public findById = async (user_id: number): Promise<any> => {
      const user = await db.User.findOne({
         where: {
            id: user_id,
         },
         attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
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
      await db.User.update(data, {
         where: {
            id: user_id,
         },
      });
   };

   public delete = async (user_id: number): Promise<any> => {
      await db.User.destroy({
         where: {
            id: user_id,
         },
      });
   };
}

export default new UserServices();
