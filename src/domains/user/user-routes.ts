import UserController from './user-controller';
import BaseRoutes from '../../base_claseses/base-routes';
import tryCatch from '../../utils/tryCatcher';

class UserRoutes extends BaseRoutes {
   public routes(): void {
      this.router.get('/', tryCatch(UserController.index));
      this.router.post('/create', tryCatch(UserController.create));
      this.router.get('/show/:user_id', tryCatch(UserController.show));
      this.router.put('/update/:user_id', tryCatch(UserController.update));
      this.router.delete('/delete/:user_id', tryCatch(UserController.delete));
   }
}

export default new UserRoutes().router;
