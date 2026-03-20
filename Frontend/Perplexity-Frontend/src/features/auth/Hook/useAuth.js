import {useDispatch} from "react-redux"
import { register,login,getMe } from "../Services/auth.api"
import { setUser,setLoading,setError } from "../auth.slice"


export function useAuth(){

const dispatch = useDispatch()

async function handleRegister({username,email,password}) {
  try{
    dispatch(setLoading(true))

    const data = await register({username,email,password})

    return data

  }catch(err){

    const message = err.response?.data?.message || "Registration failed"
    dispatch(setError(message))

    return { success:false, message }

  }finally{
    dispatch(setLoading(false))
  }
}


async function handleLogin({email,password}) {
  
try{

  dispatch(setLoading(true))
  const data = await login({email,password})

dispatch(setUser(data.user))
return data


}catch(err){
  const message = err.response?.data?.message || "Login failed"

  dispatch(setError(message))

  return { success:false, message }

}finally{
  dispatch(setLoading(false))
}

}


async function handleGetMe (){
  try{
    dispatch(setLoading(true))
    const data =  await getMe()
    dispatch(setUser(data.user))
    return data

  }catch(err){
    dispatch(setError(err.response?.data?.message || "Failed to fetch user"))
  }finally{
    dispatch(setLoading(false))
  }
}

return{
  handleRegister,handleLogin,handleGetMe
}

}

