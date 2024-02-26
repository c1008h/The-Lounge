'use client'
import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { NextUIProvider } from "@nextui-org/react";
import {CardTemplate, ButtonTemplate, FormTemplate, BoxTemplate} from '../components'
import {textMessages} from '../constants/SAMPLEMESSAGES'
import {chatSessions} from '../constants/Sessions'
import {Divider} from "@nextui-org/react";
import axios from 'axios';
import {SessionProps, TextMessageProps } from '../interfaces/messages'
import SocketIOClient from 'socket.io-client';

export default function Home() {
  const [message, setMessage] = useState<string>()

  if (typeof process.env.NEXT_PUBLIC_SOCKET_PORT === 'undefined') {
    throw new Error('NEXT_PUBLIC_SOCKET_PORT is not defined');
  }

  const PORT = process.env.NEXT_PUBLIC_SOCKET_PORT
  // const socket = SocketIOClient(PORT);

  // useEffect(() => {
  //   console.log("TEXT MESSAGES:", textMessages)
  // }, [])

  const handleValueChange = (value: string) => setMessage(value);

  const handleMessageSubmit = async () => {
    try {
      const data = { message };
      console.log(data)
      console.log(process.env.NEXT_PUBLIC_SOCKET_PORT)

      const response = await axios.post(PORT, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // console.log("Success:", response)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleDeleteSession = async (sessionId: string) => console.log("DELETE BUTTON!")

  return (
    <NextUIProvider>
      <div className="flex flex-col min-h-screen bg-neutral-400	">
        <div className="flex flex-row flex-1 ">
          {/* LEFT SESSION NAVIGATION */}
          <div className="flex flex-col h-screen w-1/3"> 
            <div className='bg-neutral-500 w-full h-20 justify-center items-center relative flex'><h1 className='text-center'>EXTRA COOL CHAT</h1></div>
            {chatSessions.map((session, index) => (
              <React.Fragment key={`session-${index}`} >
                <div className='flex flex-row justify-between p-3'>
                  <BoxTemplate 
                    id={session.id}
                    chatWith={session.chatWith}
                    boxStyle={'flex items-center justify-start'}
                  />
                  <ButtonTemplate label='X' className='justify-center' onPress={() => handleDeleteSession(session.id)}/>
                </div>
                <Divider className="my-4 self-center" />
              </React.Fragment>
            ))}
            <div>

            </div>
          </div>

          {/* RIGHT SIDE OF SCREEN */}
          <div className="w-2/3 h-screen bg-gray-100 flex flex-col gap-4 relative">
            <div className='relative flex top-0 bg-slate-400 w-full h-24 justify-center items-center'>
              <h3 className='text-center'>RECIPRICANTS NAME</h3>
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
                onValueChange={handleValueChange}
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
    </NextUIProvider>
  );
}
