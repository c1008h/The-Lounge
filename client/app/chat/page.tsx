'use client'
import React, { useState, useEffect } from 'react'
import Image from "next/image";
import {CardTemplate, ButtonTemplate, FormTemplate, BoxTemplate, Error, InputForm, Loading} from '@/components'
import { useSessionsListener } from '@/hooks/useSessionsListener';
import { useSession } from '@/context/SessionContext';
import { useParticipantsListener } from '@/hooks/useParticipantsListener';
import { useParticipants } from '@/context/ParticipantsContext';
import { useChatListener } from '@/hooks/useChatListener';
import { useChat } from '@/context/ChatContext';

import {textMessages} from '@/constants/SAMPLEMESSAGES'
import { Socket } from "socket.io-client";
import { useAuth } from '@/provider/AuthProvider';
import Sidebar from './Sidebar';

export default function Page() {
  const [message, setMessage] = useState<string>('') // ONE MESSAGE
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [uid, setUid] = useState<string>()
  const [addToChat, setAddToChat] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState('');

  const { currentUser } = useAuth();

  const { addSession, deleteSession, leaveSession } = useSession()
  const { sessions, loading: sessionLoading, error: sessionError, sessionDetails } = useSessionsListener(currentUser?.uid || null)
  const { addParticipant, removeParticipant, removeSpecificParticipant } = useParticipants();
  const { participants, error: participantError } = useParticipantsListener(chatSessionId);
  const { sendMessage } = useChat()
  const { messages, error: chatError } = useChatListener(chatSessionId)

  useEffect(() => {
    if (currentUser) {
      setUid(currentUser.uid)
    }
  }, [currentUser])

  console.log("SESSIONS FROM USER:", sessions)
  console.log("SESSIONS details from real time:", sessionDetails)
  // console.log("UID", uid)
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value);
  
  const handleAddParticipant = () => {
    const participantName = inputValue.trim();
    console.log("PART NAME:", participantName)
    const isAlreadyAdded = participants.some(p => p.name === participantName);

    if (participantName && !isAlreadyAdded) {
      const newParticipant = { uid: '1234', name: participantName, role: "participant" };
      addParticipant(newParticipant);
      setInputValue(''); 
    }
  };

  const handleSendMessage = () => {
    if (!uid) return

    const messageData = {
      message: message,
      sender: uid,
      timestamp: new Date().toISOString()
    }

    sendMessage(messageData)
  }

  if (sessionLoading) return <Loading message={'Loading sessions...'} />
  
  if (sessionError) {
    console.error(sessionError);
    return <Error message={'Error loading sessions. Please try again later.'} error={sessionError}/>
  }

  if (!currentUser) {
    return <Error message={'Please login to view this page.'} />
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-400	">
      <div className="flex flex-row flex-1 ">
        {/* LEFT SESSION NAVIGATION */}
        <Sidebar 
          sessions={sessionDetails}
          handleAddNewSession={addSession}
        />
        {/* RIGHT SIDE OF SCREEN */}
        <div className="w-2/3 h-screen bg-gray-100 flex flex-col gap-4 relative">
          <div className='relative flex top-0 bg-slate-400 w-full h-24 justify-center items-center'>
            {addToChat ? (
              <div className='flex items-center flex-row bg-slate-400 text-white' >
                <label className='mr-2'>To: </label>
                {participants.map((participant, index) => (
                  <div key={index} className='participant-block mr-2 mb-2 bg-gray-300 text-gray-700 p-2 rounded-lg flex items-center'>
                    {participant.name}
                  </div>
                ))}
                <input 
                  value={inputValue}
                  className='bg-slate-400 no-border outline-none'
                  onChange={(e) => setInputValue(e.target.value)} 
                  onKeyDown={(event) => { 
                    if (event.key === 'Enter' || event.key === ' ') {
                      handleAddParticipant(); 
                    } else if (event.key === 'Backspace' && !inputValue.trim()) {
                      removeParticipant();
                    }
                  }}
                />
                <ButtonTemplate
                  onPress={() => addSession()}
                  label={'+'}
                  disabled={participants.length < 1}
                />
              </div>
            ) : (
              <h3 className='text-white'>To: RECIPRICANTS NAME</h3>
            )}
          </div>
          {/* CHAT LOG SHOULD TAKE UP MOST OF THE HEIGHT */}
          {textMessages.map((message, index) => (
            <React.Fragment key={`message-${index}`}>
              <CardTemplate 
                id={message.id}
                message={message.message}
                sender={message.sender}
                timestamp={message.timestamp}
                alignment={message.sender === 'SELF' ? 'right' : 'left'}
              />
            </React.Fragment>
          ))}
          {/* TEXT BOX SHOULD BE BOTTOM OF SCREEN */}
          <div className="w-2/3 flex fixed bottom-0 p-4 bg-white">
            <FormTemplate 
              className={'bg-white shadow rounded-lg overflow-hidden'}
              onValueChange={(value: string) => setMessage(value)}
              value={message}
            />
            <ButtonTemplate 
              className=""
              label={"Send"}
              onPress={() => {
                if (message.trim()) {
                  handleSendMessage()
                  setMessage('')
                } else {
                  console.error("message is empty")
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
