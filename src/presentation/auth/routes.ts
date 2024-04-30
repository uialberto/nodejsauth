import { Router } from 'express';
import { AuthController } from './controller';
import {AuthService, EmailService } from '../services';
import { envs } from '../../config';




export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    const emailService = new EmailService(
      envs.MAILER_SERVICE, 
      envs.MAILER_EMAIL, 
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );
      
    const authService = new AuthService(emailService);

    const contoller = new AuthController(authService);

    // Definir las rutas
    router.post('/login', contoller.loginUser );
    router.post('/register', contoller.registerUser );
    router.get('/validate-email/:token', contoller.validateEmail);



    return router;
  }


}

