import { Router } from "express";
import { registerContrller,verifyEmail ,loginController, getMe,resendEmail} from "../controllers/auth.controller.js";
import { validateRegister,loginValidator } from "../validation/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router()

// @route POST /api/auth/register
// @desc Register a new user
// @access public
// @body {username, email, password}

authRouter.post("/register",validateRegister,registerContrller)


// @route POST /api/auth/verify-email
// @desc Verify user's email address 
// @access public
// @query {token}

authRouter.get("/verify-email",verifyEmail)



// @route POST /api/auth/login
// @desc Login user and return JWT token
// @access public
// @body {email, password}

authRouter.post("/login",loginValidator,loginController)


// @route POST /api/auth/get-me
// @desc Get current gogged in user's details
// @access Private

authRouter.get("/get-me",authUser,getMe)


authRouter.post("/resend-verification-email",resendEmail)

export default authRouter