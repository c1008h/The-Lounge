'use client'
import React, { useEffect } from 'react'
import Image from "next/image";
import { NextUIProvider } from "@nextui-org/react";
import {CardTemplate, ButtonTemplate, FormTemplate, BoxTemplate} from '../components'
import {textMessages} from '../constants/SAMPLEMESSAGES'
import {chatSessions} from '../constants/Sessions'
import {Divider} from "@nextui-org/react";

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
      <div className="flex flex-col min-h-screen bg-neutral-400	">
        {/* <header className='w-screen bg-neutral-500 h-20'>

        </header> */}
        <div className="flex flex-row flex-1">
          {/* LEFT SESSION NAVIGATION */}
          <div className="flex flex-col h-screen w-1/3 pr-8 gap-3 p-2"> 
            {chatSessions.map((session, index) => (
              <>
                <BoxTemplate 
                  key={session.id}
                  id={session.id}
                  chatWith={session.chatWith}
                />
                <Divider className="my-4 self-center" />
              </>
            ))}
          </div>

          {/* RIGHT SIDE OF SCREEN */}
          <div className="w-2/3 h-screen bg-gray-100 flex flex-col gap-4 static">
            {/* CHAT LOG SHOULD TAKE UP MOST OF THE HEIGHT */}
            {textMessages.map((message, index) => (
              <CardTemplate 
                key={index}
                id={message.id}
                message={message.message}
                sender={message.sender}
                timestamp={message.timestamp}
                alignment={message.sender === 'SELF' ? 'right' : 'left'}
              />
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
