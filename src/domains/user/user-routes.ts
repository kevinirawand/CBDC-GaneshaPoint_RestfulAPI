import UserController from './user-controller';
import BaseRoutes from '../../base_claseses/base-routes';
import tryCatch from '../../utils/tryCatcher';
import authToken from '../../middlewares/auth-token-middleware';
import validateCredentials from '../../middlewares/validate-credentials-middleware';
import { updatePassword, updateProfile } from './user-schema';

class UserRoutes extends BaseRoutes {
   public routes(): void {
      this.router.get('/', [authToken, tryCatch(UserController.index)]);
      this.router.post('/', [authToken, tryCatch(UserController.create)]);
      this.router.get('/:user_id', [authToken, tryCatch(UserController.show)]);
      this.router.put('/:user_id', [
         authToken,
         validateCredentials(updateProfile),
         tryCatch(UserController.update),
      ]);
      this.router.put('/:user_id/update-password', [
         authToken,
         validateCredentials(updatePassword),
         tryCatch(UserController.updatePassword),
      ]);
      this.router.delete('/:user_id', [
         authToken,
         tryCatch(UserController.delete),
      ]);
   }
}

export default new UserRoutes().router;
