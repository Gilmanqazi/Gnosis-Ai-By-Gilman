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

app.set("trust proxy", 1);

// --- 🛠️ PATH SETUP (The Most Robust Way) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Agar app.js 'src' folder mein hai, toh 2 baar bahar nikalna hoga (.. , ..)
// Agar app.js direct 'Backend' root mein hai, toh sirf 1 baar (..)
const frontendPath = path.resolve(__dirname, "..", "..", "Frontend", "Perplexity-Frontend", "dist");

// Server start hote hi check karega ki path sahi hai ya nahi
if (fs.existsSync(frontendPath)) {
    console.log("✅ Frontend Path Found:", frontendPath);
} else {
    console.log("❌ Frontend Path NOT Found:", frontendPath);
    console.log("💡 Tip: Check if 'dist' folder exists and folder names are correct.");
}

// --- 🌐 MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// --- 🔒 CORS ---
app.use(cors({
    origin:"https://gnosis-ai-by-gilman.onrender.com",
    credentials: true
}));

// --- 🚀 API ROUTES ---
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// --- 📂 STATIC FILES ---
app.use(express.static(frontendPath));

// --- 🎯 CATCH-ALL ROUTE (Safe Method for Express 5/Node 22) ---
// '*' ki jagah hum middleware use kar rahe hain taaki crash na ho
app.use((req, res, next) => {
    // Agar API route nahi mila toh 404 return karein
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ message: "API endpoint not found" });
    }

    // Baki sabhi requests ke liye Frontend ki index.html bhejein
    const indexPath = path.join(frontendPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("Frontend build files are missing. Please run 'npm run build'.");
    }
});

export default app;