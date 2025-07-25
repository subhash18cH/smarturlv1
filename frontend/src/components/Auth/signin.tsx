import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import toast from 'react-hot-toast';

const Signin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  interface LogInFormat {
    email: string;
    password: string;
  }

  const [logindata, setlogindata] = useState<LogInFormat>({
    email: '',
    password: '',
  });

  const handleformLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', logindata);
      if (response.status === 200) {
        toast.success('Login Successful');
        localStorage.setItem('JWT', response.data.token);
        navigate('/home');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error in Logging in!');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setlogindata({ ...logindata, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="bg-white p-6 sm:p-8 w-full sm:max-w-md rounded-xl shadow-md space-y-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[#5052ce] text-2xl sm:text-3xl font-bold">Welcome back</h2>
          <p className="text-red-500 text-sm mt-2">
            Since we're using a free server, the first response might take a few seconds. Thank you for waiting!
          </p>
        </div>

        <form onSubmit={handleformLogin} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-sm text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={logindata.email}
                onChange={handleValueChange}
                required
                placeholder="john@gmail.com"
                className="w-full py-2 px-3 border border-gray-300 rounded-md mt-1 focus:outline-2 focus:outline-blue-400 transition duration-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                required
                name="password"
                type="password"
                value={logindata.password}
                onChange={handleValueChange}
                placeholder="******"
                className="w-full py-2 px-3 border border-gray-300 rounded-md mt-1 focus:outline-2 focus:outline-blue-400 transition duration-200"
              />
            </div>
          </div>

          <div>
            <button
              disabled={loading}
              type="submit"
              className={`bg-[#5052ce] hover:bg-[#3f4191] text-white font-semibold px-4 py-2 rounded-md w-full transition duration-200 ${loading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                }`}
            >
              {loading ? 'Loading...' : 'Log In'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#5052ce] hover:text-[#6a6bd5] underline font-medium">
                Signup
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
