import React, { useState } from 'react'
import supabase from '../utils/supabase'
import type { Session, User } from '@supabase/supabase-js'
import useUserContext from '../hooks/useUserContext'
import { useNavigate } from 'react-router'



const Login: React.FC = () => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const navigate = useNavigate()

    const handleLogin = async (): Promise<{ user: User | null; session: Session | null } | null> => {
        if (!email || !password) {
            throw new Error('Email and password are required')
        }

        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            throw new Error(error.message)
        }
        return data ?? null
    }

    
    const { setUser, setSession } = useUserContext()

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const data = await handleLogin()
            console.log('Logged in', data)
            if (data) {
                setUser(data.user ?? null)
                setSession(data.session ?? null)
                navigate('/edit')
            }
        } catch (err: any) {
            console.error('Login error', err?.message ?? err)
            // TODO: surface error to the user
        }
    }

  return (
        <main className='min-h-screen flex items-center justify-center'>

            <form onSubmit={onSubmit} className='bg-amber-50 flex flex-col gap-4 rounded-sm p-5' aria-label="Login form">
                    <div>
                        <label htmlFor="teacher" className='sr-only'>
                            Email
                        </label>
                        <input 
                            id='teacher' 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className='border-2 border-gray-400/50 rounded-sm placeholder:text-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm text-black/90 w-full'
                            placeholder='Tutor Email'
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
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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
        </main>
  )
    }
    
  

export default Login