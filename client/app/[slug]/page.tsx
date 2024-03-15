"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { ButtonTemplate, ModalTemplate, InputForm } from '@/components';
import { useSession } from '@/context';

export default function Anon({ params }: { params: { slug: string } }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [displayName, setDisplayName] = useState<string>()
  const { currentAnonSessionId } = useSession()


  const [isSessionDeleted, setIsSessionDeleted] = useState(false);
  const [message, setMessage] = useState('');
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  console.log("this is param:", params.slug)
  useEffect(() => {
    // const tempId = generateTempId();
    // setUserId(tempId)
    setShowModal(true)
  }, [])

  // Function to delete the session
  const deleteSession = () => {
    // Perform the logic to delete the session here
    // For example, make an API call to delete the session from the database
    // After deleting the session, you can redirect the user to another page or display a message confirming the deletion
    setIsSessionDeleted(true);
  };

  // Function to copy the share link to the clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${currentAnonSessionId}`);
    setIsLinkCopied(true);
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  if (isSessionDeleted) {
    // Redirect the user to another page after deleting the session
    router.push('/');
    return null; // Render nothing while redirecting
  }

  // Mock data for the number of people in the chatroom
  const numberOfPeople = 5; // Replace with actual count
  // const sessionId = 1234

  if (showModal) {
    return (
      <ModalTemplate
        label="Welcome to the super secret chatting website"
        onClose={() => setShowModal(false)}
        visible={showModal}
      >
        <div className='flex flex-row items-center'>
          <InputForm onValueChange={(value: string) => setDisplayName(value)} value={displayName} placeholder={'Enter your name'}/>
        </div>
        {/* <ButtonTemplate label='Save' className='justify-center' onPress={() => handleSearchFriend()}/> */}
      </ModalTemplate>)
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4 flex justify-between flex-col">
        <div className='flex flex-row justify-between'>
          <div>Chat Room</div>
          <div>{numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'} in the chat</div>
        </div>
        <div>
          {/* Instructions for sharing the chatroom link */}
          Share this link with friends to chat: {`${window.location.origin}/chatroom/${currentAnonSessionId}`}
          <button onClick={copyLinkToClipboard} className="ml-2 px-2 py-1 bg-gray-600 text-white rounded-md">{isLinkCopied ? 'Copied!' : 'Copy Link'}</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Chat messages will be displayed here */}
        <div className="flex flex-col space-y-2">
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white py-2 px-4 rounded-lg max-w-3/4">Sample message 1</div>
          </div>
          <div className="flex justify-start">
            <div className="bg-gray-300 py-2 px-4 rounded-lg max-w-3/4">Sample message 2</div>
          </div>
          {/* Add more chat messages as needed */}
        </div>
      </div>
      <div className="bg-gray-800 p-4 flex justify-between items-center">
          <input 
            type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." 
            className="mr-2 px-4 py-2 border border-gray-300 rounded-md w-full" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Send</button>
      
      </div>
    </div>
  )
}
