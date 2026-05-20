'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const queryClient = useQueryClient()

    const handleSignIn = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await axios.post('/api/auth/login', 
                { email, password },
                { withCredentials: true }
            )

            await queryClient.invalidateQueries({ queryKey: ['me'] })
            router.push('/admin/dashboard')

        } catch (err) {
            setError(err?.response?.data?.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-linear-to-r from-red-50 to-white text-black p-6'>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5 }}
                    className='w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/30'
                >
                    <h1 className='text-2xl font-semibold text-center mb-6 text-gray-900'>
                        Welcome Back
                    </h1>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='mb-4 text-sm text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg py-2 px-3'
                        >
                            {error}
                        </motion.p>
                    )}

                    <form className='flex flex-col gap-4' onSubmit={handleSignIn}>
                        <input
                            className='bg-white/10 border border-white/30 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400'
                            type="email"
                            required
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className='relative'>
                            <input
                                className='w-full bg-white/10 border border-white/30 rounded-lg p-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400'
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder='Enter Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition'
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>

                        <motion.button
                            type='submit'
                            disabled={loading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            className='mt-2 px-8 py-3 flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-60 rounded-xl font-medium transition'
                        >
                            {loading ? <ClipLoader size={20} color='white' /> : "Login"}
                        </motion.button>
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default SignIn