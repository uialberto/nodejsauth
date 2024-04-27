
import jwt from 'jsonwebtoken'; // CTRL + .
import { envs } from './envs';


const JWT_SEED = envs.JWT_SEED;


export class JwtAdapter{

//  DI ??

    static async generateJwt(payload:any, duration: string = '2h')
    {

        return new Promise((resolve) => {

            jwt.sign(payload, JWT_SEED, {expiresIn: duration},(err, token) => {

                if(err) return resolve(null);
                
                
                return resolve(token);


            });
        })            
    }

    static validateJwt(token: string)
    {
        //TODO Pendiente
        throw new Error('Not Implemented');
        return;
        
    }

}