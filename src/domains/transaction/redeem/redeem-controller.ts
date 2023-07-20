import { Request, Response } from 'express';
import redeemServices from './redeem-services';

class RedeemController {
   public redeemPoint = async (
      req: Request,
      res: Response,
   ): Promise<Response> => {
      await redeemServices.reedem(req.app.locals.user.userId, req.body.amount);

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            message: 'Redeem Successfuly!',
         },
      });
   };
}

export default new RedeemController();
