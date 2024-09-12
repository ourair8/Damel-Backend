import { prisma} from "@/config/db.config";
import type { NextFunction, Request, Response } from "express";
import { handleError } from "./errorhandler.middleware";

export const onlineMiddleware = async  (req : Request, res : Response, next : NextFunction) => {
    try {
        const id = (req as any).user?.id;
        
        await prisma.users.update(
            {
                where : {
                    id : String(id)
                },
                data : {
                    isVerified : true,
                }
            }
        )

        next()

    } catch (err : any) {
        handleError(err, res)
    }
}
