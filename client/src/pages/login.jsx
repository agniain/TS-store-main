import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosLogin } from '../axiosServices';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosLogin('/login', { email, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/');
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen'>
          <div className='w-1/3 p-4 border'>
            <h1 className='text-xl mb-4 font-bold text-center'>Log in</h1>
            <form onSubmit={handleLogin} className='flex flex-col'>
              <div className="mb-4 flex items-center">
                <label htmlFor="email" className="w-1/3 mr-2 text-left">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-md p-2 w-2/3" required />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="password" className="w-1/3 mr-2 text-left">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded-md p-2 w-2/3" required />
              </div>
              <button type="submit" className='bg-cyan-950 px-6 py-2 text-white text-center rounded hover:bg-cyan-900'>Login</button>
            </form>
          </div>
        </div>
      );       
};

export default Login;
