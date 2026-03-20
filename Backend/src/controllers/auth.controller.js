import userModel from "../models/user.model.js";
import { sendMail } from "../services/mail.server.js";
import jwt from "jsonwebtoken"


const BASE_URL = "https://gnosis-ai-by-gilman.onrender.com";

export async function registerContrller (req,res,next){

const {username, email, password} = req.body

const isUserAlreadyExists = await userModel.findOne({
  $or:[
    {email},{username}
  ]
})


if(isUserAlreadyExists){
  return res.status(400).json({
    message:"User with this email already exist",
    success:false,
    err:"User already exist"
  })
}

const user = await userModel.create({
  username,email,password
})

const emailVarificationToken = jwt.sign({
  email:user.email
},
process.env.JWT_SECRET)


await sendMail({
  to: email,
  subject: "Verify Your Email - Welcome to Gnosis",
  html: `
  <div style="font-family:Arial,sans-serif;">
    <h2>Welcome to Gnosis, ${username}!</h2>
    <p>Thank you for signing up. Please verify your email to activate your account.</p>

    <a 
      href="${BASE_URL}/api/auth/verify-email?token=${emailVarificationToken}" 
      style="background:#2563eb;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;">
      Verify Email
    </a>

    <p>If you didn't create this account, you can safely ignore this email.</p>
  </div>
  `
})

res.status(201).json({
  message:"Registration Successfull Verification email sent. Please check your inbox.",
  user
})

}

export async function verifyEmail(req,res){
const {token} = req.query

try{
const decoded = jwt.verify(token, process.env.JWT_SECRET)

const user = await userModel.findOne({email:decoded.email})

if(!user){
  return res.status(400).json({
    message:"Invalid token",
    success:false,
    err:"User not found"
  })
}

user.verified = true;
await user.save()
const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Email Verified</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f3f4f6; margin:0; padding:0;">

  <div style="max-width:500px; margin:80px auto; background:white; padding:40px; border-radius:10px; text-align:center; box-shadow:0 5px 15px rgba(0,0,0,0.1);">

    <h1 style="color:#16a34a;">✅ Email Verified!</h1>

    <p style="font-size:16px; color:#444;">
      Your email has been successfully verified. Your account is now fully activated.
    </p>

    <p style="font-size:15px; color:#666;">
      You can now sign in to your account and start exploring everything waiting for you.
    </p>

    <div style="margin-top:30px;">
      <a href="${BASE_URL}/login"
        style="
          background:#2563eb;
          color:white;
          padding:12px 25px;
          text-decoration:none;
          border-radius:6px;
          font-weight:bold;
          display:inline-block;
        ">
        Continue to Login
      </a>
    </div>

    <p style="margin-top:25px; font-size:13px; color:#888;">
      If you did not create this account, please ignore this message.
    </p>

  </div>

</body>
</html>
`
return res.send(html)



}catch(err){
  return res.status(400).json({
    message:"Token Inavlid or expired ",
    success:false,
    err:err.message

  })
}
}


export async function loginController (req,res){
const {email,password} = req.body;

const user = await userModel.findOne({
  $or:[
    {email},{password}
  ]
})

if(!user){
  return res.status(409).json({
message:"User not found"
  })
}

const isMatch = await user.comparePassword(password)

if(!isMatch){
  return res.status(400).json({message:"Invalid credentials"})
}


if(!user.verified){
  return res.status(400).json({
    message:"Please verify your email before logging in",
    success:false,
    err:"User not found"
  })
}

const token  = jwt.sign({
  id:user._id,
  username:user.username,
},process.env.JWT_SECRET)


res.cookie("token",token)

res.status(200).json({
  message:"User logged in successfull",
  success:true,
  user:{
    id:user._id,
    username:user.username,
    email:user.email
  }
})

}

export async function getMe (req,res){
  
const userId = req.user.id

const user = await userModel.findById(userId).select("-password");

if(!user){
  return res.status(404).json({
    message:"User not found",
    seccess:false,
    err:"User not found"
  })
}

res.status(200).json({
  message:"User fetched successfully",
  seccess:true,
  user
})

}

export async function resendEmail(req, res) {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Email already verified"
      });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const verifyLink = `${BASE_URL}/api/auth/verify-email?token=${token}`;

    await sendMail({
      to: user.email,
      subject: "Verify your email",
      html: `
        <p>Click below to verify your email</p>
        <a href="${verifyLink}">Verify Email</a>
      `
    });

    res.status(200).json({
      message: "Verification email resent successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }

}


