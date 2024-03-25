'use client'
import React, { useState } from 'react'
import Image from "next/image";
import Head from 'next/head';
import { ButtonTemplate, FeatureCard } from '@/components';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons'; // Import the message icon
import { useRouter } from 'next/navigation';
import { generateTempId } from '@/utils/generateTempId';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const handleGetStarted = () => {
    const sessionId = generateTempId()
    router.push(`/${sessionId}`)
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-20 bg-gradient-to-b from-blue-300 to-blue-500">
      <Head>
        <title>Chat with Friends</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='50%'>🚀</text></svg>" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Welcome to the Chatroom</h1>
        <p className="text-lg text-white mb-8">Connect with your friends anytime, anywhere. Share moments, have fun, and stay connected.</p>
        <ButtonTemplate 
          label="Click here to get started!"
          onPress={handleGetStarted}
          className="px-8 py-3 bg-white text-blue-500 font-semibold rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300"
        />
        <div className="mt-12 flex justify-center items-center">
          <FontAwesomeIcon icon={faComment} className="text-white text-4xl" /> {/* Use the icon */}
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <div className="flex justify-center items-center space-x-8">
            <FeatureCard 
              icon="💬"
              title="Real-time Chat"
              description="Chat instantly with your friends in real-time."
            />
            <FeatureCard 
              icon="👥"
              title="Group Chats"
              description="Create groups and chat with multiple friends at once."
            />
            <FeatureCard 
              icon="🔒"
              title="Secure"
              description="Your privacy and security are our top priorities."
            />
          </div>
        </div>
      </div>
      <footer className="text-white mt-20 flex flex-col items-center">
        <p className="mb-4">Already have an account? <Link href="/login" className="text-blue-200 hover:underline">Log in</Link></p>
        <p>Don&apos;t have an account yet? <Link href="/signup" className="text-blue-200 hover:underline">Sign up</Link></p>
      </footer>
    </div>
  );
}