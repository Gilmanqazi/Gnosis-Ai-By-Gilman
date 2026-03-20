import "dotenv/config"
import app from "./src/app.js"
import connectToDB from "./src/config/database.js"
import http from "http"
import { initSocket } from "./src/sockets/server.socket.js"


const httpServer = http.createServer(app)

initSocket(httpServer)

connectToDB()


.catch((err)=>{
  console.log("MongoDB connection failed",err);
  process.exit(1);
})


httpServer.listen(3000,()=>{
  console.log("Server is running on port 3000")
})