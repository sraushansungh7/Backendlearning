import { Router } from "express";
import {login, registerUser,logoutUser, VerifyEmail, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, getCurrentUser, changgeCurrentPassword, resendEmailvefication} from "../controllers/auth.controllers.js"
import  validate  from "../middlewares/validator.middleware.js";
import { forgotPasswordValidator, resetForgotPasswordValidator, UserChangeCurrentPasswordValidotor, userLoginValidator, userRegisterValidator } from "../validators/index.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router=Router();

//unsecirer rorute
router.route("/register").post(userRegisterValidator(),validate,registerUser);

router.route("/login").post(userLoginValidator(),login);

router.route("/verify-email/:verificationToken").get(VerifyEmail);

router.route("/refresh-token").post(refreshAccessToken);


router.route("/forgot-password").post(forgotPasswordValidator(),validate,forgotPasswordRequest);

router.route("/reset-password/:resetToken").post(resetForgotPasswordValidator(),validate,resetForgotPassword);



//Secure route these required jwttoken
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/current-user").post(verifyJWT,getCurrentUser);
router.route("/change-password").post(verifyJWT,UserChangeCurrentPasswordValidotor(),validate,changgeCurrentPassword);
router.route("/resend-email-verification").post(verifyJWT,resendEmailvefication);

export default router;