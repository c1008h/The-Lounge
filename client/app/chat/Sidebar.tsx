"use client"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@/context';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'
import { initializeParticipants } from '@/features/participants/participantSlices';
import { useParticipantsListener } from '@/hooks'

import { ButtonTemplate, Divider, BoxTemplate } from '@/components'

interface SessionProps {
    sessionId: string;
    lastmessage: string;
    participants: string[];
    timestamp: Date | number | string;
}

interface SidebarProps {
    userId?: string;
    sessions: SessionProps[];
    handleAddNewSession: () => void;
}

export default function Sidebar({
    sessions,
    handleAddNewSession,
    userId
}: SidebarProps) {
    const { addASession, selectSession, deleteSession, leaveSession, currentSessionId } = useSession()
    const { participants } = useParticipantsListener(currentSessionId);

    const dispatch = useDispatch(); 

    // if (!Array.isArray(sessions) || sessions.length === 0) {
    //     return null; 
    // }

    useEffect(() => {
        console.log('sessions:', sessions)

        if (sessions.length > 0) {
            const firstSessionId = sessions[0].sessionId;
            console.log("first session ID in context to select:", firstSessionId)
            dispatch(selectSessionToState(firstSessionId));
            selectSession(firstSessionId)
        }
    }, [dispatch, sessions, selectSession])

    const handleSelectSession = (sessionId: string) => {
        dispatch(selectSessionToState(sessionId));
        selectSession(sessionId)
    }
    
    // console.log("Current session id in sidebar:", currentSessionId)

    const handleDeleteSession = async (sessionId: string, userId: string) => {
        if (!sessionId) return
        deleteSession(sessionId, userId)
    }
    // console.log("SESSIONSS DETAILSSS:", sessions)
    console.log('uid', userId)

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

            {!sessions ? (
            <>
            </>
            ) : (
                <>
                    {sessions.map((session, index) => (
                        <React.Fragment key={`session-${index}`}>
                            <div className={`flex flex-row justify-between p-3 ${session.sessionId === currentSessionId ? 'bg-blue-100' : 'bg-white'}`} onClick={() => handleSelectSession(session.sessionId)}>
                                <BoxTemplate 
                                    id={session.sessionId}
                                    message={session.lastmessage}
                                    timestamp={session.timestamp}
                                    // chatWith={session.participants}
                                    boxStyle={'flex items-center justify-start'}
                                />
                                <ButtonTemplate label='X' className='justify-center' onPress={() => handleDeleteSession(session.sessionId, userId)}/>
                            </div>
                            <Divider className="my-4 self-center" />
                        </React.Fragment>
                    ))}
                </>
            )}
            
        </div>
    )
}
