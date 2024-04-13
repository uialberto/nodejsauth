import { UserModel } from "../../data";
import { CustomError, RegisterUserDto } from "../../domain";
import { UserEntity } from "../../domain/entities/user.entity";




export class AuthService{

    constructor(){}


    public async registerUser(registerUserDto: RegisterUserDto)
    {

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if( existUser) throw CustomError.badRequest('Email already exist');

        try {
            
            const user = new UserModel(registerUserDto);
            await user.save();

            //Encriptar la Contraseña
            //Generar un JWT Autenticacion de Usuario
            // Email de Confirmacion

            const {password, ...userEntity} = UserEntity.fromObject(user);
            return {user: userEntity, token:'ABC'};
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

        return 'Todo Ok'
    }
}