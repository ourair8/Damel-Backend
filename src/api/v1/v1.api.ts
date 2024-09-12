import authRoute from "@/routes/v1/auth.route";
import feature from "@/routes/v1/feature.route";



import express from "express";

const v1 = express.Router()
    .use("/auth", authRoute)
    .use("/feature", feature)

export default v1