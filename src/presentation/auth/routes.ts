import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';




export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    const authService = new AuthService();

    const contoller = new AuthController(authService);

    // Definir las rutas
    router.post('/login', contoller.loginUser );
    router.post('/register', contoller.registerUser );
    router.get('/validate-email/:token', contoller.validateEmail);



    return router;
  }


}

