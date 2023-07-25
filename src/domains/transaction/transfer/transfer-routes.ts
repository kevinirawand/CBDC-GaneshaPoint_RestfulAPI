import TransferController from './transfer-controller';
import BaseRoutes from '../../../base_claseses/base-routes';
import tryCatch from '../../../utils/tryCatcher';
import authToken from '../../../middlewares/auth-token-middleware';

class TransferRoutes extends BaseRoutes {
   public routes(): void {
      this.router.post('/', [authToken, tryCatch(TransferController.transfer)]);
      this.router.get('/history', [
         authToken,
         tryCatch(TransferController.history),
      ]);
   }
}

export default new TransferRoutes().router;
