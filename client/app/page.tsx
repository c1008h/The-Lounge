'use client'
import React, { useEffect } from 'react'
import Image from "next/image";
import { NextUIProvider } from "@nextui-org/react";
import {CardTemplate, ButtonTemplate, FormTemplate} from '../components'
import {textMessages} from '../constants/SAMPLEMESSAGES'
import {chatSessions} from '../constants/Sessions'

export default function Home() {
  useEffect(() => {
    console.log("TEXT MESSAGES:", textMessages)
  }, [])

  const handleValueChange = (value: string) => {
    console.log('New value:', value);
  }; 

  const handleMessageSubmit = async () => {
    console.log('button is pressed')
  }
  return (
    <NextUIProvider>
      <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-1">
          {/* LEFT SESSION NAVIGATION */}
          <div className="h-full w-1/3 pr-8 bg-red-500"> 
          {chatSessions.map((session, index) => (
              <CardTemplate 
                key={session.id}
                id={session.id}
                chatWith={session.chatWith}

              />
            ))}
          </div>

          {/* RIGHT SIDE OF SCREEN */}
          <div className="w-2/3 h-full bg-gray-100">
            {/* CHAT LOG SHOULD TAKE UP MOST OF THE HEIGHT */}
            {textMessages.map((message, index) => (
              <CardTemplate 
                key={message.id}
                id={message.id}
                message={message.message}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}
            <div className="bg-white-100 shadow rounded-lg overflow-y-auto">
              
            </div>
            {/* TEXT BOX SHOULD BE BOTTOM OF SCREEN */}
            <div className="flex sticky bottom-0 p-4 bg-white">
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
