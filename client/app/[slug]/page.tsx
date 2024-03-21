"use client"
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation';
import { ButtonTemplate, ModalTemplate, InputForm } from '@/components';
import { useSession, useChat, useParticipants } from '@/context';
import { useAnonParticipantsListener, useAnonChatListener } from '@/hooks';
import { TempUserProps } from '@/interfaces/TempUser';
import { formatTimestamp } from '@/utils/formatTimestamp'
import { storeUserSessionData, clearUserSessionData } from '@/utils/anonLocalStorage'

export default function Anon({ params }: { params: { slug: string } }) {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [anonUser, setAnonUser] = useState<TempUserProps>()
  const [displayName, setDisplayName] = useState<string>('')

  const { currentAnonSessionId, addUserToAnon, tempUser } = useSession()
  const { sendAnonMessage } = useChat()
  const { removeAnon } = useParticipants()

  const { participants } = useAnonParticipantsListener(params.slug)
  const { messages, error } = useAnonChatListener(params.slug)
  const router = useRouter()

  const [isSessionDeleted, setIsSessionDeleted] = useState(false);
  const [message, setMessage] = useState('');
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [messages]);

  useEffect(() => {
    setShowModal(true)
  }, [])

  useEffect(() => {
    if (tempUser && tempUser.uid) {
      console.log("temp user:", tempUser)
      storeUserSessionData(params.slug, { displayName: tempUser.displayName, uid: tempUser.uid})
      setAnonUser({ displayName: tempUser.displayName, uid: tempUser.uid })
      setShowModal(false) 
    } 
  }, [tempUser])

  useEffect(() => {
    const existingSessionData = localStorage.getItem(params.slug);
    if (existingSessionData) {
      const { uid, displayName } = JSON.parse(existingSessionData);
      if (uid && displayName) {
        setAnonUser({ uid, displayName });
        setShowModal(false);
      }
    } else {
      setShowModal(true);
    }
  }, [params.slug]);

  useEffect(() => {
    if (!participants || !participants.length || !anonUser || !anonUser.uid) return
    let participantCount = participants.length

    const handleLeave = () => {
      // const confirmationMessage = 'Are you sure you want to leave?';
      // event.returnValue = confirmationMessage;
      // return confirmationMessage;
      clearUserSessionData(params.slug)
      removeAnon(anonUser.uid, params.slug, participantCount)
    }

    window.addEventListener('beforeunload', handleLeave)

    return () => window.removeEventListener('beforeunload', handleLeave);
  }, [removeAnon, anonUser, params.slug, participants])

  // console.log("Current anon session id", currentAnonSessionId)

  const copyLinkToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/${currentAnonSessionId}`)
      .then(() => {
        setIsLinkCopied(true);
        setTimeout(() => {
          setIsLinkCopied(false);
        }, 2000);
      })
      .catch(err => console.error('Could not copy text: ', err));
    }
  };

  if (isSessionDeleted) {
    router.push('/');
    return null; 
  }
  
  const handleAddUser = async () => {
    try {
      setShowError(false)
      setLoading(true)

      const user = await addUserToAnon(displayName, params.slug)

      console.log("Resolved user:", user);
      console.log('temp user in page file:', tempUser)

      if (user) {
        setShowModal(false)
      } else {
        setShowError(true)
      }
    } catch (error) {
      console.error("Error adding user:", error)
      setShowError(true);
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage =  () => {
    if (!message || !anonUser) return
    try {
      const messageData = {
        message: message.trim(),
        sender: anonUser
      }

      sendAnonMessage(params.slug, messageData)
    
    } catch (error) {
      console.error("Error sending message:", error)

    } finally {
      setMessage('')
    }
  }

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
        {showError && <p>Error saving. Try again!</p>}
        <ButtonTemplate 
          label='Save' 
          className='justify-center' 
          onPress={handleAddUser}
          disabled={displayName.trim().length <= 3}
        />
      </ModalTemplate>)
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4 flex justify-between flex-col">
        <div className='flex flex-row justify-between'>
          <div>Chat Room</div>
          <div>{participants?.length} {participants?.length === 1 ? 'person' : 'people'} in the chat</div>
        </div>
        <div>
          {/* Instructions for sharing the chatroom link */}
          Share this link with friends to chat: {`${window.location.origin}/${params.slug}`}
          <button onClick={copyLinkToClipboard} className="ml-2 px-2 py-1 bg-gray-600 text-white rounded-md">{isLinkCopied ? 'Copied!' : 'Copy Link'}</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Chat messages will be displayed here */}
        <div className="flex flex-col space-y-2">
          {messages?.map((message, index) => {
            const senderIsTempUser = message.sender.uid === anonUser?.uid;
            const senderDisplayName = senderIsTempUser ? "" : participants.find(p => p.uid === (message.sender.uid || message.sender))?.displayName || "Unknown";

            // const senderDisplayName = senderIsTempUser ? "" : participants?.find(p => p.uid === message.sender)?.displayName || "Unknown";
            // const formattedTimestamp = message.timestamp.toDate().toLocaleString();
            const formattedTimestamp = formatTimestamp(message.timestamp)
            const isLastMessage = index === messages.length - 1;

            return (
              <div 
                key={index} 
                className={`flex ${message.sender.uid === anonUser?.uid ? 'justify-end' : 'justify-start'}`}
                ref={isLastMessage ? messagesEndRef : null} // Attach the ref here
              >
                <div className="flex flex-col max-w-3/4">
                  <p className={`text-sm ${senderIsTempUser ? 'text-right' : 'text-left'}`}>{senderDisplayName}</p>
                  <div className={`py-2 px-4 rounded-lg max-w-3/4 ${message.sender.uid === anonUser?.uid ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                    <p>{message.message}</p>
                    {/* <p>{formattedTimestamp}</p> */}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="bg-gray-800 p-4 flex justify-between items-center">
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
      </div>
    </div>
  )
}
