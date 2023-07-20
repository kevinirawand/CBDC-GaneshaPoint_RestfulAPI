import BaseError from '../../../base_claseses/base-error';
import statusCodes from '../../../errors/status-codes';
import db from '../../../models';

class RedeemServices {
   public reedem = async (senderId: number, amount: number): Promise<void> => {
      const userSender = await db.Wallet.findOne({
         include: [
            {
               model: db.User,
               as: 'User',
               attributes: {
                  exclude: ['createdAt', 'updatedAt'],
               },
               where: {
                  id: senderId,
               },
            },
         ],
         attributes: {
            exclude: ['createdAt', 'updatedAt', 'wallet_id'],
         },
      });

      try {
         await userSender.update({
            ganesha_point: userSender.dataValues.ganesha_point - amount,
         });
      } catch (error: any) {
         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            error!.message.toString(),
         );
      }
   };
}

export default new RedeemServices();
