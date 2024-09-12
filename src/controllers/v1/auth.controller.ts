import { error } from "@/middlewares/index.middleware";
import { type Response, type Request } from "express";
import { auth } from "@/services/v1/index.service";

export const registerByEmailController = async(req : Request, res : Response) => {
    try {
        const { email, password, name, username } = await req.body
        
        await auth.registerUser(email, password, name, username)


        return res.status(201).json({
            status : true,
            message : 'success'
        })

    } catch (err) {
        await error.handleError(err as Error, res)
    }
}

export const loginByEmailController = async(req : Request, res : Response) => {
    try {
        const { email, password } = await req.body

        const data = await auth.loginUser(email, password)
        return res.status(201).json({
            status : true,
            message : 'success',
            data
        })

    } catch (err) {
        await error.handleError(err as Error, res)
    }
}