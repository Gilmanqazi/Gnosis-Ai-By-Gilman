import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app.routes';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../features/auth/Hook/useAuth';

const App = () => {

  const auth = useAuth()

  useEffect(()=>{
auth.handleGetMe()
  },[])

  return (
    <div>
<RouterProvider router={router}/>
<ToastContainer/>
    </div>
  );
};

export default App;