'use client'
import React from 'react'
import Head from 'next/head';
import Link from 'next/link';
import {ButtonTemplate} from '@/components';

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-20 bg-gradient-to-b from-blue-300 to-blue-500">
      <Head>
        <title>Sign Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-center max-w-md w-full mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Create an Account</h1>
        <form className="w-full">
          <div className="mb-4">
            <input type="text" placeholder="Username" className="w-full px-4 py-2 rounded-md shadow-sm" />
          </div>
          <div className="mb-4">
            <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-md shadow-sm" />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-md shadow-sm" />
          </div>
          <div className="mb-8">
            <input type="password" placeholder="Confirm Password" className="w-full px-4 py-2 rounded-md shadow-sm" />
          </div>
          <ButtonTemplate 
            label="Sign Up"
            className="w-full px-8 py-3 bg-white text-blue-500 font-semibold rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300"
          />
        </form>
        <p className="text-white mt-4">Already have an account? <Link href="/login" className="text-blue-200 hover:underline">Log in</Link></p>
      </main>
    </div>
  );
}
