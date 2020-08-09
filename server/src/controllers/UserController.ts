import { Request, Response } from 'express';
import * as EmailValidator from 'email-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User, { IUserToCreate } from '../models/User'
import transporter from '../services/mail';

export default class userController {

    static async create(request: Request, response: Response){

        const { name, surname, email, password } = request.body as IUserToCreate;

        try {
            if(!EmailValidator.validate(email)){
                return response.status(400).json({error: 'Invalid email format'});
            }

            const hashedPassword = await hashPassword(password);
    
            const user_id = await User.create({
                name,
                surname,
                email: email.toLowerCase(),
                password: hashedPassword,
            });
            
            return response.status(201).send();
        } catch (error) {
            return response.status(400).json({error: 'Server Error'});
        }
    }

    static async auth(request: Request, response: Response){
        const { email, password } = request.body as IUserToCreate;

        try {
            const user = await User.findByEmail(email.toLowerCase(), {select: { password: true } });

            if(!user){
                throw Error('User not finded');
            }

            const validPassword = await isValidPassword(password, user.password);

            if(!validPassword){
                throw Error('Invalid Password');
            }

            request.session = {
                token: createJWT({id: user.id}),
            }

            return response.end();
        } catch (error) {
            // console.log(error)
            return response.status(400).json({error: 'Bad Credentials'});
        }
    }

    static async isAuthenticated(request: Request, response: Response){
        return response.end();
    }

    static async logout(request: Request, response: Response){
        request.session = null;
        return response.end();
    }

    static async forgotPassword(request: Request, response: Response){
        const { email } = request.body as IUserToCreate;

        try {
            if(!EmailValidator.validate(email)){
                return response.status(400).json({error: 'Invalid email format'});
            }
            
            const user = await User.findByEmail(email.toLowerCase());

            if(user){

                const token = randomToken();
                const now = new Date();
                now.setHours(now.getHours() + 1);

                const userEdited = await User.setPasswordReset(user.id, token, now.toString());

                if(userEdited){
                    transporter.sendMail({
                        from: `Proffy <noreply@proffy.com>`,
                        to: `${user.name} <${user.email}>`,
                        subject: 'Proffy - Solicitação de Redefinição de Senha',
                        html: `Você está recebendo esse email pois foi solicitado a redefinição de senha na plataforma Proffy<br>Clique <a href="http://localhost:3000/redefinir_senha/${token}">aqui!<a> para redefinir a sua senha<br><br>token: ${token}`,
                    });
                }
            }

            return response.end();

        } catch (error) {
            return response.status(400).json({error: 'Bad request'});
        }

    }

    static async resetPassword(request: Request, response: Response){
        const { email, password, token } = request.body as {[key: string]: string};

        const user = await User.findByEmail(email.toLowerCase(), { select: { passwordReset: true } });

        if(user && user.passwordResetToken === token){

            const now = new Date().getTime();
            const expiresIn = new Date(user.passwordResetTokenExpires).getTime();

            if(now < expiresIn){
                const hashedPassword = await hashPassword(password);

                const updated = await User.update(user.id, {
                    password: hashedPassword,
                    passwordResetToken: null,
                    passwordResetTokenExpires: null
                })

                if(!updated){
                    return response.status(400).json({error: 'Bad request'});
                }

                return response.end();
            }
        }

        return response.status(400).json({error: 'Invalid token'});
        
    }

    static async profile(request: Request, response: Response){
        try {
 
            const user_id = request.user?.id;
            if(!user_id){
                throw Error('Server Error');
            }
 
            const user = await User.findById(user_id);
 
            return response.json(user);
            
        } catch (error) {
 
         return response.status(400).json({error: 'Bad Request'});
 
        }
    }

    static async editProfile(request: Request, response: Response){
        const { name, surname, whatsapp, bio, avatar } = request.body as Partial<IUserToCreate>

        try {
            const user_id = request.user?.id;
            if(!user_id){
                throw Error('Server Error');
            }

            const updated = User.update(user_id, {
                name,
                surname,
                whatsapp,
                bio,
                avatar
            });

            if(!updated){
                throw Error('Bad Request');
            }

            return response.end();
            
        } catch (error) {
            return response.status(400).json({error: 'Bad Request'});
        }

    }
}

async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

async function isValidPassword(password: string, hashedPassword: string){
    return await bcrypt.compare(password, hashedPassword);
}

function createJWT(data: any) {
    return jwt.sign(data, 'secret', {
        expiresIn: '24h',
    })
}

function randomToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}