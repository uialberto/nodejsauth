import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { UserEntity } from "../../domain/entities/user.entity";
import { EmailService } from "./email.service";




export class AuthService{

    constructor(

        private readonly emailService: EmailService,

    ){}

    private sendEmailValidationLink = async( email: string) => 
    {
        const token = await JwtAdapter.generateJwt({email});
        if( !token) throw CustomError.internalServer('Error while creating JWT Email Token.');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
        
        <h1>Validacion Email</h1>
        <p>Pulse Click sobre el siguiente Link para validar el Email: </p>
        <a href="${link}"> Validar Email: ${email} </a>

        `

        const options = {
            to: email,
            subject: "Validacion Email",
            htmlBody: html
        }

        const isSend = await this.emailService.sendEmail(options);

        if(! isSend ) throw CustomError.internalServer('Error Enviando Email de Validacion.');

        return true;

    }

    public async registerUser(registerUserDto: RegisterUserDto)
    {

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if( existUser) throw CustomError.badRequest('Email already exist');

        try {
            
            const user = new UserModel(registerUserDto);

            //Encriptar la Contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            await this.sendEmailValidationLink(user.email!);

            //Generar un JWT Autenticacion de Usuario
            const token = await JwtAdapter.generateJwt({id: user.id});
            if( !token) throw CustomError.internalServer('Error while creating JWT.');


            // Email de Confirmacion



            const {password, ...resto} = UserEntity.fromObject(user);
            
            return {
                user: resto, 
                token: token
            };

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
        
        // const token = await JwtAdapter.generateJwt({id: user.id, email: user.email});

        const token = await JwtAdapter.generateJwt({id: user.id});

        if( !token) throw CustomError.internalServer('Error while creating JWT.');

        return {
            user: userEntity,
            token: token
        }
    }

    public validateEmail = async (token: string) => {

        const payload = await JwtAdapter.validateJwt(token);
        if( !payload) throw CustomError.unAuthorized('Token Invalido.');
        const {email} = payload as {email: string};
        if( !email) throw CustomError.internalServer('Email Not In Token');        
        const user = await UserModel.findOne({email});
        if( !user) throw CustomError.internalServer('Email Not Exists');
        user.emailValidated = true;
        await user.save();
        return true;        
    }

}