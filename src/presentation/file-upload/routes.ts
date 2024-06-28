import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';




export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    
    const controller = new FileUploadController(new FileUploadService());
    

    router.use(FileUploadMiddleware.containFiles);
    router.use(TypeMiddleware.validTypes(['users','products','categories']));
    // Definir las rutas
    //api/upload/single/<user|category|products>
    //api/upload/multiple/<user|category|products>
    router.post('/single/:type', controller.uploadFile);
    router.post('/multiple/:type',controller.uploadMultipleFiles);
    // router.post('/multiple/:type', [TypeMiddleware.validTypes(['users','products','categories'])] ,controller.uploadMultipleFiles);
    return router;
  }


}

