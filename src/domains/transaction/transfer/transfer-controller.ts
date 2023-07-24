import { Request, Response } from 'express';
import transferServices from './transfer-services';
import userServices from '../../user/user-services';

class TransferController {
   public transfer = async (req: Request, res: Response): Promise<Response> => {
      console.info(req.app.locals.user);

      await transferServices.send(
         req.app.locals.user.userId,
         req.body.phone_number,
         req.body.amount,
      );

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            message: 'Transfer Successfuly!',
         },
      });
   };

   public notification = async (
      req: Request,
      res: Response,
   ): Promise<Response> => {
      const userNotification = await transferServices.getNotificationList(
         req.app.locals.user.userId,
      );

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: userNotification,
      });
   };
}

export default new TransferController();
