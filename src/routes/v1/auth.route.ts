import express from 'express'
import { authControllerv1 } from '@/controllers/v1/index.controller'

const authRoute = express.Router()
    .post("/register", authControllerv1.registerByEmailController)
    .post("/login", authControllerv1.loginByEmailController)

export default authRoute