import express from "express"
import authRouter from "./Routes/auth.route.js"
import chatRouter from "./Routes/chat.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
import path from "path"

const app = express()

// ✅ Render path fix
const frontendPath = path.join(process.cwd(), "Frontend/Perplexity-Frontend/dist")

// ✅ CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://gnosis-ai-by-gilman.onrender.com"
  ],
  credentials: true
}))

// ✅ Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

// ✅ API routes
app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter)

// ✅ frontend serve
app.use(express.static(frontendPath))

// ✅ catch-all
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"))
})

export default app