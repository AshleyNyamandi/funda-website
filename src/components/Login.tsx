import React from 'react'
import supabase from '../utils/supabase'

const Login: React.FC = () => {
  return (
        <form action="" className='bg-amber-50 flex flex-col gap-4 rounded-sm p-5' aria-label="Login form">
            <div>
                <label htmlFor="teacher" className='sr-only'>
                    Tutor Number
                </label>
                <input 
                    id='teacher' 
                    type="text" 
                    className='border-2 border-gray-400/50 rounded-sm placeholder:text-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm text-black/90 w-full'
                    placeholder='Tutor Number'
                    aria-required="true"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className='sr-only'>
                    Password
                </label>
                <input 
                    id='password' 
                    type="password" 
                    className='border-2 border-gray-400/50 rounded-sm placeholder:text-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm text-black/90 w-full'
                    placeholder='Password'
                    aria-required="true"
                    required
                />                
            </div>
            <button 
                type="submit"
                className="flex items-center justify-center bg-gray-700 text-white/90 py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform border border-white/40 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-normal w-full"
                aria-label="Log in to your account"
            >
                LOG IN
            </button>
        </form>
  )
}

export default Login