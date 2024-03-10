"use client"
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@/context';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'

import { ButtonTemplate, Divider, BoxTemplate } from '@/components'

interface SessionProps {
    sessionId: string;
    lastmessage: string;
    participants: string[];
    timestamp: Date | number | string;
}

interface SidebarProps {
    sessions: SessionProps[];
    handleAddNewSession: () => void;
}

export default function Sidebar({
    sessions,
    handleAddNewSession
}: SidebarProps) {
    const { addASession, deleteSession, leaveSession, currentSessionId } = useSession()

    const handleDeleteSession = async (sessionId: string) => {
        if (!sessionId) return
        deleteSession(sessionId)
    }
    console.log("SESSIONSS DETAILSSS:", sessions)

    return (
        <div className="flex flex-col h-screen w-1/3"> 
            <div className='bg-neutral-500 w-full h-20 items-center relative flex justify-between'>
                <h4 className=''>Profile Icon</h4>
                <div className='flex flex-row'>
                    <h4 className=''>Friendlist</h4>
                    <h4 className=''>Icon</h4>
                </div>


            </div>
            <ButtonTemplate label='NEW CHAT' className='m-4' onPress={() => handleAddNewSession()}/>

            {sessions.map((session, index) => (
                <React.Fragment key={`session-${index}`} >
                    <div className='flex flex-row justify-between p-3'>
                        <BoxTemplate 
                            id={session.sessionId}
                            message={session.lastmessage}
                            timestamp={session.timestamp}
                            // chatWith={session.participants}
                            boxStyle={'flex items-center justify-start'}
                        />
                        <ButtonTemplate label='X' className='justify-center' onPress={() => handleDeleteSession(session.sessionId)}/>
                    </div>
                    <Divider className="my-4 self-center" />
                </React.Fragment>
            ))}
        </div>
    )
}
