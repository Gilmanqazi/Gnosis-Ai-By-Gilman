import userModel from "../models/user.model.js";
import { sendMail } from "../services/mail.server.js";
import jwt from "jsonwebtoken";

const BASE_URL = "https://gnosis-ai-by-gilman.onrender.com";

// ================= REGISTER =================
export async function registerContrller(req, res) {
  try {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ email }, { username }]
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = await userModel.create({
      username,
      email,
      password
    });

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    await sendMail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome ${username}</h2>
        <a href="${BASE_URL}/api/auth/verify-email?token=${token}">
          Verify Email
        </a>
      `
    });

    res.status(201).json({
      success: true,
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

// ================= VERIFY EMAIL =================
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });
    

    if (!user) {
      return res.status(400).json({
        message: "Invalid token"
      });
    }

    user.verified = true;
    await user.save();

    return res.send(`
      <h2>Email Verified ✅</h2>
      <a href="${BASE_URL}/login">Go to Login</a>
    `);

  } catch (err) {
    return res.status(400).json({
      message: "Token invalid or expired"
    });
  }
}

// ================= LOGIN =================
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    // ✅ FIXED (important)
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        message: "Please verify your email first"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,     // Security ke liye
      secure: true,       // Render (HTTPS) ke liye COMPULSORY hai
      sameSite: "None",   // 'N' Capital hona chahiye (String format)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
      path: "/"           // Taaki har route par cookie mile
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

// ================= GET ME =================
export async function getMe(req, res) {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ================= RESEND EMAIL =================
export async function resendEmail(req, res) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Already verified"
      });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await sendMail({
      to: email,
      subject: "Verify Email",
      html: `
        <a href="${BASE_URL}/api/auth/verify-email?token=${token}">
          Verify Email
        </a>
      `
    });

    res.status(200).json({
      message: "Verification email sent"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}