import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api';
import toast from 'react-hot-toast';

const Signin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  interface LogInFormat {
    email: string,
    password: string
  }

  const [logindata, setlogindata] = useState<LogInFormat>({
    email: "",
    password: ""
  });

  const handleformLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", logindata);
      if (response.status === 200) {
        toast.success("Register Successfull");
        navigate("/home")
      }
    } catch (error) {
      toast.error("Error in sending request")
    } finally {
      setLoading(false);
    }
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setlogindata({ ...logindata, [e.target.name]: e.target.value })
  }

  return (
    <div className=' min-h-screen flex justify-center items-center '>

      <div className='bg-white p-6 w-full lg:max-w-md max-w-sm rounded-xl shadow-lg space-y-6'>

        {/* Heading  */}
        <div className='text-center'>
          <h2 className='text-[#5052ce] text-2xl font-bold'>Welcome back</h2>
          <p className='text-red-500 text-sm mt-2'>Welcome! Since we're using a free server, the first response might take a few seconds. Thank you for waiting!
          </p>
        </div>

        <form onSubmit={handleformLogin} className='space-y-4'>

          <div className='space-y-4'>

            <div className=''>
              <label className='block font-semibold text-sm text-gray-700' htmlFor="email">Email</label>
              <input
                type="email"
                name='email'
                value={logindata.email}
                onChange={handleValueChange}
                required
                placeholder='john@gmail.com'
                className='w-full py-2 px-3 border border-gray-300 rounded-md mt-1 
              focus:outline-2
              focus:outline-blue-400 ' />
            </div>
            <div className=''>
              <label className='block font-semibold text-sm text-gray-700' htmlFor="password">Password</label>
              <input
                required
                name="password"
                type="password"
                value={logindata.password}
                onChange={handleValueChange}
                placeholder='******'
                className='w-full py-2 px-3 border border-gray-300 rounded-md mt-1 focus:outline-2
              focus:outline-blue-400' />
            </div>

          </div>

          <div>
            <button
              disabled={loading}
              type='submit'
              className='bg-[#5052ce] hover:bg-[#3f4191] text-white font-semibold px-4 py-2 rounded-md w-full'>{loading ? "Loading..." : "Log In"}</button>
          </div>

          <div className='text-center'>
            <span className='text-gray-600 '>Don't have an account?{' '}
              <Link to="/signup" className='text-[#5052ce] hover:text-[#6a6bd5] underline font-medium'>Signup</Link>
            </span>
          </div>

        </form>

      </div>

    </div>
  )
}

export default Signin