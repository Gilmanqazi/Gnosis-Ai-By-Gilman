import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

// Routes imports
import authRouter from "./Routes/auth.route.js";
import chatRouter from "./Routes/chat.route.js";

const app = express();

// --- 🛠️ PATH SETUP ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 💡 IMPORTANT: 
 * Agar app.js 'Backend/src' folder ke andar hai, toh 2 baar bahar jana hoga ("..", "..").
 * Agar app.js directly 'Backend' root mein hai, toh sirf 1 baar ("..") kaafi hai.
 */
const frontendPath = path.resolve(__dirname, "..", "..", "Frontend", "Perplexity-Frontend", "dist");

// Server start hote hi path validation
if (fs.existsSync(frontendPath)) {
    console.log("✅ Frontend Dist Found at:", frontendPath);
} else {
    console.warn("⚠️ WARNING: Frontend Dist NOT Found! Path checked:", frontendPath);
    console.info("👉 Tip: Run 'npm run build' inside your 'Perplexity-Frontend' folder.");
}

// --- 🌐 MIDDLEWARE ---
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// --- 🔒 CORS ---
app.use(cors({
    origin: "http://localhost:5173", // Development ke liye
    credentials: true
}));

// --- 🚀 API ROUTES ---
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// --- 📂 STATIC FILES ---
// Yeh line 'dist' folder ke andar ki assets (JS, CSS, Images) serve karegi
app.use(express.static(frontendPath));

// --- 🎯 CATCH-ALL ROUTE (For SPA/React Routing) ---
/**
 * Yeh route sabse niche hona chahiye. 
 * Agar koi request API ya static file se match nahi hoti, 
 * toh React ki index.html serve hogi.
 */
app.get((req, res) => {
    // API requests ko index.html par redirect hone se rokne ke liye
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ message: "API endpoint not found" });
    }

    const indexPath = path.join(frontendPath, "index.html");
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("<h1>404 - Frontend Build Missing</h1><p>Please build your frontend application.</p>");
    }
});

export default app;