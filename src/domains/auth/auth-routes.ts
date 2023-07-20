import AuthController from './auth-controller';
import BaseRoutes from '../../base_claseses/base-routes';
import validateCredentials from '../../middlewares/validate-credentials-middleware';
import { loginSchema, registerSchema } from './auth-schema';
import tryCatch from '../../utils/tryCatcher';
import authToken from '../../middlewares/auth-token-middleware';

class AuthRoutes extends BaseRoutes {
   public routes(): void {
      this.router.post('/register', [
         validateCredentials(registerSchema),
         tryCatch(AuthController.register),
      ]);
      this.router.post('/login', [
         validateCredentials(loginSchema),
         tryCatch(AuthController.login),
      ]);
      this.router.post('/logout', [authToken, tryCatch(AuthController.logout)]);
   }
}

export default new AuthRoutes().router;
