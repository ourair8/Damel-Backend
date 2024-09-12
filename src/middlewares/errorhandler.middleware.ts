import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { type Response } from "express";

export class ErrorWithStatusCode extends Error {
    public statusCode : number 
    constructor(message : string , statusCode : number) {
        super(message);
        this.name = this.constructor.name
        this.statusCode = statusCode
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

export const handleError = async (err : Error | ErrorWithStatusCode | PrismaClientKnownRequestError, res : Response) => {

    if (err instanceof ErrorWithStatusCode) {
        return res.status(err.statusCode).json({ message : err.message })
    } 

    if (err instanceof PrismaClientKnownRequestError){
        if (err.code == 'P2002' && err.meta && Array.isArray(err.meta.target)) {
            const field = err.meta.target[0];
            return res.status(400).json({
                message: `${field} is already used`
            });
        }

         else {
            return res.status(200).json({
                message : 'bad request'
            })
        }   
    }

    if (err instanceof PrismaClientValidationError){
        return res.status(200).json({
            message : 'invalid input'
        })
    }
    
    return res.status(500).json({ message : 'internal server error'})

}