import express from "express"
import authRouter from "./Routes/auth.route.js"
import cookieParser  from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
import chatRouter from "./Routes/chat.route.js"
import path from "path"

const app = express()

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
  methods:["GET", "POST", "PUT", "DELETE"]
}))

app.use(express.static(path.resolve("../Frontend/Perplexity-Frontend/dist")))

app.use((req, res) => {
  res.sendFile(path.resolve("../Frontend/Perplexity-Frontend/dist/index.html"))
})

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))


app.use("/api/auth",authRouter)
app.use("/api/chats",chatRouter)
    
export default app