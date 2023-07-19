import UserController from './user-controller';
import BaseRoutes from '../../base_claseses/base-routes';
import tryCatch from '../../utils/tryCatcher';
import authToken from '../../middlewares/auth-token-middleware';

class UserRoutes extends BaseRoutes {
   public routes(): void {
      this.router.get('/', [authToken, tryCatch(UserController.index)]);
      this.router.post('/', [authToken, tryCatch(UserController.create)]);
      this.router.get('/:user_id', [authToken, tryCatch(UserController.show)]);
      this.router.put('/:user_id', [
         authToken,
         tryCatch(UserController.update),
      ]);
      this.router.delete('/:user_id', [
         authToken,
         tryCatch(UserController.delete),
      ]);
   }
}

export default new UserRoutes().router;
