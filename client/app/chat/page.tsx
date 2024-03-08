'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Image from "next/image";
import { NextUIProvider } from "@nextui-org/react";
import {CardTemplate, ButtonTemplate, FormTemplate, BoxTemplate, InputForm} from '@/components'
import {textMessages} from '@/constants/SAMPLEMESSAGES'
import {SessionProps, TextMessageProps } from '@/interfaces/messages'
import socketClient from '@/services/socketioConfig'
import { Socket } from "socket.io-client";
import { useChatParticipants } from '@/hooks/useChatParticipants';
import { useSessions } from '@/hooks/useSessions';
import { useAuth } from '@/provider/AuthProvider';
import Sidebar from './Sidebar';

export default function Page() {
  const [message, setMessage] = useState<string>('') // ONE MESSAGE
  const [messages, setMessages] = useState<TextMessageProps[]>([]) // ARRAY OF MESSAGES
  // const [sessions, setSessions] = useState<string[]>([])
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  // const [participants, setParticipants] = useState<ParticipantProps[]>([]);
  const [uid, setUid] = useState<string>()
  const [addToChat, setAddToChat] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState('');

  const { currentUser } = useAuth();
  const { participants, addParticipant, removeSpecificParticipant, removeParticipant } = useChatParticipants();
  const { sessions, loading, error, deleteSession, sessionDetails } = useSessions(currentUser?.uid || '');

  if (typeof process.env.NEXT_PUBLIC_SOCKET_PORT === 'undefined') throw new Error('NEXT_PUBLIC_SOCKET_PORT is not defined');
  const PORT = process.env.NEXT_PUBLIC_SOCKET_PORT

  useEffect(() => {
    if (currentUser) {
      setUid(currentUser.uid)
    }
  }, [currentUser])

  console.log("SESSIONS FROM USER:", sessions)
  console.log("SESSIONS details from real time:", sessionDetails)
  // console.log("UID", uid)

  useEffect(() => {
    const socketInstance: Socket = socketClient();
    setSocket(socketInstance);

    socketInstance.on('newMessage', (incomingMessage: TextMessageProps) => {
      setMessages((prevMessages) => [...prevMessages, incomingMessage])
    })

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('chatSessionId', (data) => {
      const { chatSessionId } = data;
      console.log("Received chatSessionId:", chatSessionId);
      setChatSessionId(chatSessionId);
    });
  
    return () => {
      socket.off('chatSessionId');
    };
  }, [socket]);

  const handleMessageSubmit = async () => {
    console.log("MESSAGE:", message)

    if (message?.trim() && socket) {
      socket.emit("sendMessage", {
        sessionId: chatSessionId!,
        message: message, 
        sender: uid, 
        timestamp: new Date().toISOString() 
      });    
      setMessage('')
    } else {
      console.error("Message is empty or Socket connection is not initialized");
    }
  }

  const handleAddNewSession = async () => setAddToChat(true)

  const createNewSession = async () => {
    console.log("createNewSession called");

    if (!socket) {
      console.error("socket connection is not initialized")
      return;
    }
    const sessionData = {
      initiator: uid,
      participants: participants
    }
    console.log("SESSION DATA:", sessionData)

    socket.emit('startchat', sessionData, (response: { chatSessionId: string }) => {
      if (!response) {
        console.error("Error creating chat session:", response)
      }
      console.log("RESPONSE CHAT SESSIONS ID:", sessionData)
      setChatSessionId(response.chatSessionId);
    });
  }


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

  console.log('PARTICIPANTS:', participants)
  if (loading) {
    return <div>Loading sessions...</div>;
  }
  
  if (error) {
    console.error(error);
    return <div>Error loading sessions. Please try again later.</div>;
  }
  if (!currentUser) {
    return <div>Please login to view this page.</div>;
  }
  return (
    // <NextUIProvider>
      <div className="flex flex-col min-h-screen bg-neutral-400	">
        <div className="flex flex-row flex-1 ">
          {/* LEFT SESSION NAVIGATION */}
          <Sidebar 
            sessions={sessionDetails}
            handleAddNewSession={handleAddNewSession}
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
                    onPress={() => createNewSession()}
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
                onPress={handleMessageSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    // </NextUIProvider>
  );
}
