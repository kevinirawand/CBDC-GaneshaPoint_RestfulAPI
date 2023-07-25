import BaseError from '../../../base_claseses/base-error';
import statusCodes from '../../../errors/status-codes';
import db from '../../../models';
import { Op } from '@sequelize/core';

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
            statusCodes.BAD_REQUEST.message,
            'User Receiver Does not exist',
         );
      }

      if (!userSender) {
         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            'User Sender Does not exist',
         );
      }

      console.info(userReceiver);

      if (userSender.ganesha_point - amount < 0) {
         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            'Avail, Balance insufficient',
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
                        userSender.dataValues.ganesha_point - amount,
                  },
                  {
                     transaction: transactionData,
                  },
               );

               await db.Transaction.create(
                  {
                     phone_number_sender: userSender.User.dataValues.no_hp,
                     phone_number_receiver: userReceiver.User.dataValues.no_hp,
                     amount: amount,
                     status: 'success',
                  },
                  {
                     transaction: transactionData,
                  },
               );
            },
         );
      } catch (error: any) {
         await db.Transaction.create({
            phone_number_sender: userSender.User.dataValues.no_hp,
            phone_number_receiver: userReceiver.User.dataValues.no_hp,
            amount: amount,
            status: 'fail',
         });

         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            error!.message.toString(),
         );
      }
   };

   public getNotificationList = async (userId: number): Promise<any> => {
      const user = await db.User.findOne({
         where: {
            id: userId,
         },
      });

      if (!user) {
         throw new BaseError(
            400,
            statusCodes.BAD_REQUEST.message,
            'User Does not exist',
         );
      }

      const notifList: any = await db.Transaction.findAll({
         where: [{ phone_number_sender: user.no_hp }, { status: 'success' }],
      });

      return notifList;
   };
}

export default new TransferServices();
