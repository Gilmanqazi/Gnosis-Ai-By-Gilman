import {createBrowserRouter, Navigate} from "react-router-dom"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import ChatUI from "../features/chat/pages/ChatUI"
import Protected from "../features/auth/components/Protected"

export const router = createBrowserRouter([
  {
path:"/",
element: <Protected><ChatUI/></Protected>
  },
  {
    path:"/login",
    element: <Login/>

  },
  {
    path:"/register",
    element: <Register/>
  },
  {
    path:"/chat",
    element:<Navigate to="/" replace/>
  }
])