import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosRegister } from '../axiosServices';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const navigate = useNavigate(); 

    const handleSignup = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axiosRegister('/register', {
                full_name: fullName,
                email,
                username,
                password,
            });
    
            console.log('Full response:', response);
    
            if (response && response.data) {
                console.log('registered successfully:', response.data);
                setRegistrationSuccess(true);          
            } else {
                console.error('Error during registration: No response data');
            }
        } catch (error) {
            console.error('Error during registration:', error.response ? error.response.data : error.message);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };    

    return (
      <div className='w-full flex items-center justify-center h-screen'>
        <div className='w-1/3 p-4 border'>
        {registrationSuccess ? (
          <div className="border border-gray-600 mt-5 py-4">
            <div className="text-black mb-4">
              Selamat, akun berhasil terdaftar!
            </div>
            <div className="mt-4">
              <button onClick={handleLoginRedirect} className='bg-cyan-950 px-6 py-2 text-white rounded hover:bg-cyan-900'>
                Login
              </button>
            </div>
          </div>
        ) : (
          <div className='p-4'>
            <h1 className='text-xl mb-4 font-bold text-center'>Sign Up</h1>
            <form onSubmit={handleSignup} className='flex flex-col'>
              <div className="mb-4 flex items-center">
                <label htmlFor="fullName" className="w-1/3 mr-2 text-left">Nama Lengkap:</label>
                <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border rounded-md p-2 w-2/3" required />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="email" className="w-1/3 mr-2 text-left">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-md p-2 w-2/3" required />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="username" className="w-1/3 mr-2 text-left">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="border rounded-md p-2 w-2/3" required />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="password" className="w-1/3 mr-2 text-left">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded-md p-2 w-2/3" required />
              </div>
              <button type="submit" className='bg-cyan-950 px-6 py-2 text-white text-center rounded hover:bg-cyan-900'>Sign Up</button>
            </form>
          </div>
        )}
        </div>
      </div>
    );      
};


export default Signup;
