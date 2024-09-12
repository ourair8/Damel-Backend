import { featureControllerv1 } from "@/controllers/v1/index.controller";
import express, { type Router } from "express";
import { verifytoken } from "@/middlewares/auth.middleware";
import image from "@/config/multer.config";
//TODO : rate-limiter, verifytoken ☑, checkrole, add validator, redis cache for get

const feature : Router = express.Router()
    //user-related
    //user
    .get('/user', verifytoken, featureControllerv1.getUserProfileController) //yes
    .patch('/user', verifytoken, featureControllerv1.editUserInfoController) //no
    //feed-(user's)
    .post('/post', verifytoken, image.image.single('image_link'), featureControllerv1.createPostController) //yes
    .get('/post', verifytoken, featureControllerv1.getPostController) //yes
    //feed-(other's)
    .get("/feed/post-speech", verifytoken, featureControllerv1.getRandomSpeechPosts) //yes
    .get("/feed/post-learn", verifytoken, featureControllerv1.getRandomLearnPosts) //yes
    //activity-(other's)
    .get('/activity/reminders', verifytoken, featureControllerv1.getRandomActivityReminder) //yes
    .get('/activity/diaries', verifytoken, featureControllerv1.getRandomActivityDiary) //yes
    //activities-post
    .post('/reminders', verifytoken, featureControllerv1.createReminderController) //yes - user
    .post('/diary', verifytoken, featureControllerv1.createDiaryController) //yes - user
    //activities-get
    .get('/reminders', verifytoken, featureControllerv1.getRemindersController) //yes - user
    .get('/diaries', verifytoken, featureControllerv1.getDiaryController) //yes - user
    //online
    .get("/online", verifytoken, featureControllerv1.getAllUserOnline)

export default feature


//legacy

    // .post('/like', verifytoken, featureControllerv1.likePostController)
    // .post('/unlike', verifytoken, featureControllerv1.unlikePostController)

    // .get('/learn', verifytoken, featureControllerv1.feedByFollowingController)
    // .get('/speech', verifytoken, featureControllerv1.feedByTagsController)