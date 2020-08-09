import { Request, Response, NextFunction,  } from 'express';
import jwt from 'jsonwebtoken';

export default function isAuthenticated (request: Request, response: Response, next: NextFunction){
    const session = request.session;
    if(!session || !session.token){
        return response.status(401).json({error: 'Not authorized'});
    }

    return jwt.verify(session.token as string, 'secret', (error, decoded)=>{
        if(error){
            return response.status(401).json({error: 'Not authorized'});
        }

        request.user = decoded as typeof request.user;

        return next();
    });

}