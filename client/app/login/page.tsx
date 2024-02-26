'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ButtonTemplate } from '@/components';

export default function Page() {
    const [password, setPassword] = useState<string>()
    const [email, setEmail]= useState<string>()

    return (
    <div className="flex flex-col justify-center items-center min-h-screen py-20 bg-gradient-to-b from-blue-300 to-blue-500">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-center max-w-md w-full mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Log In to Your Account</h1>
        <form className="w-full" >
          <div className="mb-4">
            <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-md shadow-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-md shadow-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-white text-blue-500 font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300 mb-4">Log In</button>
        </form>
        <div className="mb-8">
            <p className="text-white">Or log in with:</p>
            <ButtonTemplate 
                label={"Log In with Google"}
                className="w-full bg-white text-blue-500 font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300 mb-2"
            />
            <ButtonTemplate 
                label={"Log In with Phone Number"}
                className="w-full bg-white text-blue-500 font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300"
            />
        </div>
        <p className="text-white">Don&apos;t have an account yet? <Link href="/signup" className="text-blue-200 hover:underline">Sign up</Link></p>
      </main>
    </div>
    );
}