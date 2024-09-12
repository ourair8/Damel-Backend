import { db } from "@/config";
import { error } from "@/middlewares/index.middleware";
import { uuidv7 } from "uuidv7";
import jwt from 'jsonwebtoken'
import { prisma } from "@/config/db.config";

export const registerUser = async (email : string, password : string, name : string, username : string) => {
    try {

        const isEmail = await db.prisma.users.findUnique({
            where : {
                email : email
            }
        })

        if (isEmail) {
            throw new error.ErrorWithStatusCode('email is already registered', 409)
        }

        const isUsername = await db.prisma.users.findUnique({
            where : {
                username : username
            }
        })

        if (isUsername) {
            throw new error.ErrorWithStatusCode('username is already registered', 409)
        }

        const hashedPassword = await Bun.password.hash(password, "argon2i")
        
        await db.prisma.users.create({
            data: {
                id: uuidv7(),
                email: email,
                password: hashedPassword,
                name: name,
                username: username,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });


        return true

    } catch (err) {
        throw err
    }
}

export const loginUser = async (email : string, password : string) => {
    try {
        const user = await db.prisma.users.findUnique({
            where : {
                email : email
            }
        })

        if(!user){
            throw new error.ErrorWithStatusCode('email is not registered', 401)
        }

        const isPassword = await Bun.password.verify(password, user.password)

        console.log(isPassword)

        if(!isPassword) {
            throw new error.ErrorWithStatusCode('password is not match', 401)
        }

        const payload = {
            id : user.id,
            username : user.username,
            name : user.name,
            avatar_link : user.meta_profile_link,
            isPublic : user.isPublic,
            isVerified : user.isVerified,
            tags : user.tags,
            role : user.role
        }

        await prisma.users.update(
            {
                where : {
                    id : String(user.id)
                },
                data : {
                    isVerified : true,
                }
            }
        )

        const token = jwt.sign(payload, (Bun.env.SECRET_KEY as unknown as string))

        return {...payload, token}


    } catch (err) {
        throw err
    }
}