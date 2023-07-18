import { Request, Response } from 'express';
import IController from '../../interfaces/controller-interface';
import { user, trend } from 'tiktok-scraper';

class TestController {
   async index(req: Request, res: Response): Promise<Response> {
      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            message: 'THIS TEST',
         },
      });
   }
}

export default new TestController();
