import BaseRoutes from '../../../base_claseses/base-routes';
import authToken from '../../../middlewares/auth-token-middleware';
import tryCatch from '../../../utils/tryCatcher';
import redeemController from './redeem-controller';

class RedeemRoutes extends BaseRoutes {
   public routes(): void {
   // this.router.post('/', [authToken, tryCatch(redeemController.redeem)]);
   }
}

export default new RedeemRoutes().router;
