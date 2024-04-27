import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { UserEntity } from "../../domain/entities/user.entity";




export class AuthService{

    constructor(){}


    public async registerUser(registerUserDto: RegisterUserDto)
    {

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if( existUser) throw CustomError.badRequest('Email already exist');

        try {
            
            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            //Encriptar la Contraseña
            //Generar un JWT Autenticacion de Usuario
            // Email de Confirmacion

            const {password, ...resto} = UserEntity.fromObject(user);
            
            return {user: resto, token:'ABC'};

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }        
    }
    public async loginUser(loginUserDto: LoginUserDto)
    {

        const user = await UserModel.findOne({email: loginUserDto.email});

        if( !user) throw CustomError.badRequest('Email o Password Invalid');

        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password ?? '');
        if( !isMatching) throw CustomError.badRequest('Email o Password Invalid');

        const {password, ...userEntity} = UserEntity.fromObject(user);
        
        return {
            user: userEntity,
            token:'ABC'
        }
    }
}