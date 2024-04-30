import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";



export class AuthMiddleware {

    static async validateJWT(req: Request, res: Response, next: NextFunction)
    {

        const authorization = req.header('Authorization');

        if(!authorization) return res.status(401).json({error:'No Token Provided'});
        if(!authorization.startsWith('Bearer ')) return res.status(401).json({error:'Invalid Bearer Token'});

        const token = authorization.split(' ').at(1) || '';

        try {
            
            const payload = await JwtAdapter.validateJwt<{id: string}>(token);
            if(!payload) return res.status(401).json({error:'Invalid Token'});

            const user = await UserModel.findById(payload.id);

            if(!user) return res.status(401).json({error:'Invalid Token - User'});

            req.body.user = UserEntity.fromObject(user);

            //TODO Validar si el usuario esta Activo

            next();

        } catch (error) {
         
            console.log(error);

            res.status(500).json({error:'Internal Server Error'});
        }
    }

}