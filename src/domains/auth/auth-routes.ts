import AuthController from './auth-controller';
import BaseRoutes from '../../base_claseses/base-routes';
import validateCredentials from '../../middlewares/validate-credentials-middleware';
import { loginSchema, registerSchema } from './auth-schema';
import tryCatch from '../../utils/tryCatcher';

class AuthRoutes extends BaseRoutes {
   public routes(): void {
      this.router.post(
         '/register',
         [validateCredentials(registerSchema)],
         tryCatch(AuthController.register),
      );
      this.router.post(
         '/login',
         [validateCredentials(loginSchema)],
         tryCatch(AuthController.login),
      );
   }
}

export default new AuthRoutes().router;
