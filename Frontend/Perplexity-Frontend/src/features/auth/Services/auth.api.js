import axios from "axios"

const api = axios.create({
  baseURL:"https://gnosis-ai-by-gilman.onrender.com",
  withCredentials:true
})

export const register = async ({username,email,password})=>{
  try{
    const res = await api.post("/api/auth/register",{
      username,email,password
    })
    console.log(res.data) // 👈 check this
    return res.data
  }catch(err){
    console.log(err)
    throw err
  }
}

export const login = async ({email, password})=>{
try{
const res = await api.post("/api/auth/login",{
  email,password
})


return res.data
}catch(err){
  console.log(err)
  throw err
}
}


export const  getMe = async ()=>{

try{
  const res = await api.get("/api/auth/get-me")

return res.data
}  catch(err){
  console.log(err)
  throw err
}
}

// export const verifyEmail = async (token)=>{
//   try{
// const res = await api.get(`/api/auth/verify-email?token${token}`)
// console.log(res)
// return res.data
//   }catch(err){
//     console.log(err)
//     throw err
//   }
// }

// export const resendVerification = async (email)=>{

//   try{
//     const res = await api.post("/api/auth/resend-verification-email",{email})
//     console.log(res)
//     return res.data
//   }catch(err){
//     console.log(err)
//     throw err
//   }
// }