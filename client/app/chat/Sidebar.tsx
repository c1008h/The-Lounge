"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'
import { initializeParticipants } from '@/features/participants/participantSlices';
import { useParticipantsListener, useSession } from '@/hooks'
import FriendList from './FriendList';
import { FaUserFriends } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";

import { RootState } from '@/features/store';
import SessionList from './SessionList';
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
    currentSessionId?: string;
}

export default function Sidebar({
    sessions,
    handleAddNewSession,
    userId,
    currentSessionId
}: SidebarProps) {
    const [displayFriend, setDisplayFriend] = useState(false)
    const [displaySession, setDisplaySession] = useState(true)
    // const userId = useSelector((state: RootState) => state.auth.user)

    // if (!Array.isArray(sessions) || sessions.length === 0) {
    //     return null; 
    // }
    
    // console.log('uid', userId)

    return (
        <div className="flex flex-col h-screen w-1/3"> 
            <div className='bg-gray-800 w-full h-20 items-center relative flex justify-between'>
                <h4 className=''>Profile Icon</h4>
                <div className='flex flex-row'>
                    {displayFriend && !displaySession ? (
                        <FaRegMessage 
                            className="w-10 h-10 cursor-pointer"
                            // style={{width:'40px', height:'40px'}} 
                            onClick={() => {
                                setDisplayFriend(false)
                                setDisplaySession(true)
                            }}
                        />
                    ) : (
                        <FaUserFriends 
                            className="w-10 h-10 cursor-pointer"
                            // style={{width:'40px', height:'40px'}} 
                            onClick={() => {
                                setDisplayFriend(true)
                                setDisplaySession(false)
                            }}
                        />
                    )}
                </div>
            </div>

            <div className="flex-grow bg-gray-200">
                {/* {displayFriend ? (
                    <FriendList userId={userId!} />
                ): (
                
                    <SessionList 
                        handleAddNewSession={handleAddNewSession}
                        sessions={sessions}
                        userId={userId!}
                    />
                )}     */}
            </div>

        </div>
    )
}
