import db from '../database/connections';

export interface IUserToCreate {
    name: string,
    surname: string,
    email: string,
    password: string,
    avatar?: string,
    whatsapp?: string,
    bio?: string,
}

export interface IUser extends Omit<IUserToCreate, 'password'>{
    id: number,
    passwordResetToken: string,
    passwordResetTokenExpires: string,
    password: string,
}

interface IFindOptions {
    select?: {
        password?: boolean,
        passwordReset?: boolean,
    }
}

export default class User {
    static async create(user: IUserToCreate){
        const response = await db('users').insert(user);
        return response[0];
    }

    static async findByEmail(email: string, options?: IFindOptions){

        const selectFields = [
            'users.id',
            'users.name',
            'users.surname',
            'users.email',
            'users.avatar',
            'users.whatsapp',
            'users.bio',
        ]

        if(options?.select?.password){
            selectFields.push('users.password');
        }
        if(options?.select?.passwordReset){
            selectFields.push('users.passwordResetToken');
            selectFields.push('users.passwordResetTokenExpires');
        }

        const response = await db('users')
            .where('users.email', '=', email)
            .select(selectFields)

        return response[0] as IUser | null;
    }

    static async findById(id: number, options?: IFindOptions){

        const selectFields = [
            'users.id',
            'users.name',
            'users.surname',
            'users.email',
            'users.avatar',
            'users.whatsapp',
            'users.bio',
        ];

        if(options?.select?.password){
            selectFields.push('users.password');
        }
        if(options?.select?.passwordReset){
            selectFields.push('users.passwordResetToken');
            selectFields.push('users.passwordResetTokenExpires');
        }

        const response = await db('users')
            .where('users.id', '=', id)
            .select(selectFields);

        return response[0] as IUser | null;
    }

    static async setPasswordReset(id: number, token: string, expiresIn: string){
        const response = await db('users')
            .where('users.id', '=', id)
            .update({
                passwordResetToken: token,
                passwordResetTokenExpires: expiresIn
            });
        
        return response;
    }

    static async update(id: number, data: {}){
        const response = await db('users')
            .where('users.id', '=', id)
            .update(data);
        
        return response;
    }
}