'use client'
import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ButtonTemplate } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'

export default function Page() {
  const [password, setPassword] = useState<string>()
  const [email, setEmail]= useState<string>()
  const [error, setError] = useState<string>()
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const router = useRouter();

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please make sure all fields are filled.")
      return
    }

    try {
      const result = await signInWithEmail(email, password)
      console.log("RESULT", result)
    } catch (error) {
      setError(`Error signing up with email: ${error}`)
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle()
      if (result) router.push('/chat')
    } catch (error) {
      console.error('Error logging in with google:', error)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-20 bg-gradient-to-b from-blue-300 to-blue-500">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-center max-w-md w-full mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Log In to Your Account</h1>
        <form className="w-full" onSubmit={handleSignUp}>
          <div className="mb-4">
            <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-md shadow-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-md shadow-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <ButtonTemplate
            label={'Login'}
            disabled={!email && !password}
            type="submit"
            className="w-full bg-white text-blue-500 font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300 mb-4"
          />
        </form>
        <p className="text-white">Don&apos;t have an account yet? <Link href="/signup" className="text-blue-200 hover:underline">Sign up</Link></p>

        <div className="mb-8">
          <div className='flex flex-row text-white items-center justify-center m-4'>
            <div className="border-t border-gray-500 w-full"></div>
            <p className="mx-4">Or</p>
            <div className="border-t border-gray-500 w-full"></div>
          </div>
          <ButtonTemplate 
            label={"Continue with Google"}
            onPress={handleGoogleLogin}
            className="w-full bg-white text-blue-500 font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300 mb-2"
          />
          <ButtonTemplate 
            label={"Continue with Phone Number"}
            className="w-full bg-white text-blue-500 font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300"
          />
        </div>
      </main>
    </div>
  );
}