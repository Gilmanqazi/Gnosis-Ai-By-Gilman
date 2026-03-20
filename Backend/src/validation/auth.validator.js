import { body,validationResult } from "express-validator";

function validate (req,res,next){
  const errors = validationResult(req)

  if(errors.isEmpty()){
    return next()
  }

  res.status(400).json({
    errors: errors.array()
  })
}

export const validateRegister = [
  body("username").trim().notEmpty().withMessage("Username is required").isLength({min: 3, max: 30}).withMessage("Username must be between 3 To 30").matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contains letter"),

  body("email").isEmail().withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("password is required").isLength({min: 6}).withMessage("Password must be  at least 6 character "),


  
  validate
]

export const loginValidator = [
  body("email").isEmail().withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("password is required"),

  
  validate
]