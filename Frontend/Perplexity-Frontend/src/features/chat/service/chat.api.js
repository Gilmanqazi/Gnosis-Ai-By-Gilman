import axios from "axios"

const api = axios.create({
  baseURL:"https://gnosis-ai-by-gilman.onrender.com",
  withCredentials:true
})

export const sendMessage = async ({message,chatId})=>{

  const response = await api.post("/api/chats/message",{
    message,chatId
  })

  console.log(response.data)
  return response.data

}

export const getChats = async ()=>{
  const response = await api.get("/api/chats")
  console.log(response.data)
  return response.data
}

export const getMessages = async (chatId) =>{
  const response = await api.get(`/api/chats/${chatId}/messages`)

  console.log(response.data)
  return response.data
}

export const deleteChat = async (chatId)=>{
  const response = await api.delete(`/api/chats/delete/${chatId}`)

  console.log(response.data)
  return response.data
}


