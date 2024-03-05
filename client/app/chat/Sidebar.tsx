"use client"
import React from 'react'
import { ButtonTemplate, Divider } from '@/components'

interface SessionProps {
    id: string;
}

interface SidebarProps {
    sessions: SessionProps[];
    handleAddNewSession: () => void;
}

export default function Sidebar({
    sessions,
    handleAddNewSession
}: SidebarProps) {
    const handleDeleteSession = async (sessionId: string) => console.log("DELETE BUTTON!")

    return (
        <div className="flex flex-col h-screen w-1/3"> 
            <div className='bg-neutral-500 w-full h-20 justify-center items-center relative flex'>
                <h1 className='text-center'>EXTRA COOL CHAT</h1>
                <ButtonTemplate label='+' className='' onPress={() => handleAddNewSession()}/>
            </div>
            {sessions.map((session, index) => (
                <React.Fragment key={`session-${index}`} >
                    <div className='flex flex-row justify-between p-3'>
                        <BoxTemplate 
                            id={session}
                            // chatWith={session.chatWith}
                            boxStyle={'flex items-center justify-start'}
                        />
                        <ButtonTemplate label='X' className='justify-center' onPress={() => handleDeleteSession(session.id)}/>
                    </div>
                    <Divider className="my-4 self-center" />
                </React.Fragment>
            ))}
            <div className='w-1/3 flex fixed bottom-0 bg-neutral-500 h-20 items-center justify-center'>
                <div className='bg-blue-400 h-10 w-10 rounded-3xl'></div>
                <ButtonTemplate label='+' className='bg-blue-400 h-10 w-10 rounded-3xl'/>
            </div>
        </div>
    )
}
