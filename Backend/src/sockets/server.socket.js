import {Server} from "socket.io"

let io;

export async function initSocket(httpServer){
  io = new Server(httpServer, {
    cors:{
      origin:"https://gnosis-ai-by-gilman.onrender.com",
      credentials:true
    }
  })

  console.log("Socket.io server is running");
  

  io.on("connection", (socket)=>{
    console.log("A user connected: " + socket.id)
  })

}

export function getIO(){

  if(!io){
    throw new Error("Socket.io not initialized");
    
  }
  return io
}