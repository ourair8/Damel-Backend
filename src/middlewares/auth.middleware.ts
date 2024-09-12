import type { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken';

export interface UserRequest extends Request {
    user?: {
      token: string;
      id: string;
      username: string;
      avatar_link: string | null;
      isPublic: boolean;
      isVerified: boolean;
      tags: string[];
      role: string;
    };
  }
  
export const verifytoken = async(req : Request, res : Response, next : NextFunction) => {
    try {
        const { authorization } = req.headers

        if(!authorization || !authorization.split(' ')[1]) {
            return res.status(200).json({
                status : true,
                message : 'token is not provided'
            })
        }

        let token = authorization.split(' ')[1]

        jwt.verify(token, String(Bun.env.SECRET_KEY), (err, decoded) => {
            if (err) {
                console.log(err)
                return res.status(401).json({ 
                    status: false,
                    message: 'Failed to authenticate token',
                    data: null 
                });
            }

            (req as UserRequest).user = decoded as UserRequest['user'];
            next();
        });


    } catch (err) {
        throw err
    }
}


export const whoIAm = async(req : Request, res : Response) => {

    try {
    const { authorization } = req.headers

    if (!authorization || !authorization.split(' ')[1]) {
        return res.json({
            status: false,
            message: 'token not provided!',
            data: null
        }).status(401);
    }

    let token = authorization.split(' ')[1];

    jwt.verify(token, Bun.env.SECRET_KEY as string, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        return res.json({
            status : true,
            message : 'success',
            data : decoded
        })
    })


    } catch(err) {
        throw err
    }
}