import router from 'next/router';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { verifyTheUser } from '../apiDuties';

const Login = () => {

  useEffect(() => {

    if(localStorage.getItem('chat-app-user'))
      router.push('/');
  }, []);

  const [userCred, setUserCred] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserCred({ ...userCred, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {

    e.preventDefault();

    if (!userCred.username && !userCred.password) {
      toast.error('Please fill all the information!!');
      return;
    }

    let userData = {
      username: userCred.username,
      password: userCred.password
    };

    try 
    {
      setUserCred({
        username: '',
        password: '',
      });

      let apiRes = await verifyTheUser(userData);

      if (apiRes.success)
        toast.success('Congrats you are succesfully registered!!');
      else 
      {
        toast.error('Please try again later due to the server issues!!');
        return;
      }

      localStorage.setItem('chat-app-user', JSON.stringify(apiRes.userInfo));

      setTimeout(() => {
        router.push('/');
      }, 2000);

    }
    catch (error) 
    {
      toast.error('Please try again later due to the server issues!!');
      console.log(error);
    }
  }



  return (
    <>
      <div className='bg-slate-900 text-white p-1 flex items-center justify-center h-[100vh]'>

        <form onSubmit={handleSubmit} className='w-1/2 flex flex-col px-6 py-5 space-y-5 bg-slate-800 rounded-md'>

          <div>
            <label htmlFor="username" className='mb-2 block text-gray-400 tracking-wider font-bold'>Username</label>
            <input type="text" name='username' className='bg-slate-800 border-b border-gray-400 p-1 text-base w-full outline-none' value={userCred.username} onChange={handleChange} autoComplete="off" />
          </div>

          <div>
            <label htmlFor="password" className='mb-2 block text-gray-400 tracking-wider font-bold'>Password</label>
            <input type="password" name='password' className='bg-slate-800 border-b border-gray-400 p-1 text-base w-full outline-none' value={userCred.password} onChange={handleChange} autoComplete="off" />
          </div>

          <div className='flex justify-center items-center'>
            <button className="bg-transparent border px-3 py-2 rounded-md w-1/10 hover:bg-slate-900 duration-200 ease-in tracking-wider" type='submit'>Login</button>
          </div>

        </form>

      </div>
      <ToastContainer position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
    </>
  )
}

export default Login
