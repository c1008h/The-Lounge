'use client'
import React, { useState } from 'react'
import Head from 'next/head';
import Link from 'next/link';
import {ButtonTemplate, Divider} from '@/components';
import { useAuth } from '@/provider/AuthProvider';
import { useRouter } from 'next/navigation'

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleSignUp = (e) => {
      e.preventDefault();
    };
    const handleGoogleSignup = async () => {
      signInWithGoogle().then((result) => {
        if (result) {
          router.push('/chat')
        }
      }).catch(error => {
        console.error("Sign-up failed:", error)
      })

      // try {
      //   const result = await signInWithGoogle(); 
      //   if (result) {
      //     console.log('Google sign-in successful:', result);
      //   } else {
      //     console.log('Google sign-in failed');
      //   }
      // } catch (error) {
      //   console.error('Error signing up with Google:', error); 
      // }
    }
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-20 bg-gradient-to-b from-blue-300 to-blue-500">
      <Head>
        <title>Sign Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-center max-w-md w-full mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Create an Account</h1>
        <form className="w-full" onSubmit={handleSignUp}>
          <div className="mb-4">
            <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-md shadow-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-md shadow-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Confirm Password" className="w-full px-4 py-2 rounded-md shadow-sm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <ButtonTemplate 
            className="w-full bg-white text-blue-500 font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300 mb-4"
            label={"Sign Up"}
            type="submit" 
          />
        </form>
        <p className="text-white">Already have an account? <Link href="/login" className="text-blue-200 hover:underline">Log in</Link></p>

        <div className="mb-8">
          <div className='flex flex-row text-white items-center justify-center m-4'>
            <Divider />
            <p className="mx-4">Or</p>
            <Divider />
          </div>
          <ButtonTemplate 
            onPress={handleGoogleSignup}
            label={"Sign Up with Google"}
            className="w-full bg-white text-blue-500 font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300 mb-2"
          />
          <ButtonTemplate 
            label={"Sign Up with Phone Number"}
            className="w-full bg-white text-blue-500 font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300"
          />
        </div>
      </main>
    </div>
  );
}