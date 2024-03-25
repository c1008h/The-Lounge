import React, { useState } from 'react'
import { MessageInputProps } from './types'

export default function MessageInput({ sendMessage, sessionId, uid, displayName }: MessageInputProps) {
  const [message, setMessage] = useState<string>('')

  const handleSendMessage = () => {
    if (!message || !uid || !displayName) return
    try {
      const messageData = {
        message: message.trim(),
        sender: { uid: uid, displayName: displayName },
        timestamp: new Date()
      }

      sendMessage(sessionId, messageData)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setMessage('')
    }
  }
    
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault(); 
        handleSendMessage();
      }}
      className="flex w-full"
    >
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Type your message..." 
        className="mr-2 px-4 py-2 border border-gray-300 rounded-md w-full" 
      />
      <button type='submit' className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => handleSendMessage()}>Send</button>
    </form>
  )
}
