import BaseError from '../../../base_claseses/base-error';
import statusCodes from '../../../errors/status-codes';
import db from '../../../models';
import userServices from '../../user/user-services';

class TransferServices {
   public send = async (
      senderId: number,
      phone_number: number,
      amount: number,
   ): Promise<void> => {
      /**
       * CARI WALLET DENGAN NO HP DI PARAMETER KEMDUIAN
       * KEMUDIAN SEBAGAI SENDER KURANGI SALDO GP
       * SEBGAAI RECEIVER TAMBAH SALDO
       */
      const userReceiver = await db.Wallet.findOne({
         include: [
            {
               model: db.User,
               as: 'User',
               attributes: {
                  exclude: ['createdAt', 'updatedAt'],
               },
               where: {
                  no_hp: phone_number,
               },
            },
         ],
         attributes: {
            exclude: ['createdAt', 'updatedAt', 'wallet_id'],
         },
      });

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

      if (!userReceiver) {
         throw new BaseError(
            400,
            statusCodes.DUPLICATE.message,
            'User Receiver Does not exist',
         );
      }

      try {
         await db.sequelize.transaction(
            async (transactionData: any): Promise<any> => {
               await userReceiver.update(
                  {
                     ganesha_point:
                        userReceiver.dataValues.ganesha_point + amount,
                  },
                  {
                     transaction: transactionData,
                  },
               );

               await userSender.update(
                  {
                     ganesha_point:
                        userReceiver.dataValues.ganesha_point - amount,
                  },
                  {
                     transaction: transactionData,
                  },
               );
            },
         );
      } catch (error: any) {
         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            error!.message.toString(),
         );
      }
   };
}

export default new TransferServices();
