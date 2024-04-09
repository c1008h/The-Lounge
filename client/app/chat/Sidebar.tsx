"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'
import { initializeParticipants } from '@/features/participants/participantSlices';
import { useSessionsListener, useSession } from '@/hooks'
import FriendList from './FriendList';
import { FaUserFriends } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import { BsList } from "react-icons/bs";
import { IoPersonAddSharp } from "react-icons/io5";

import { RootState } from '@/features/store';
import SessionList from './SessionList';
import { ButtonTemplate, Divider, BoxTemplate, InputForm, Loading, ModalTemplate } from '@/components'
import { useAuth } from '@/provider/AuthProvider';
import { addToChat } from '@/features/session/sessionSlices';
import { clearParticipants } from '@/features/participants/participantSlices';
interface SessionProps {
    sessionId: string;
    lastmessage: string;
    participants: string[];
    timestamp: Date | number | string;
}

interface SidebarProps {
    userId?: string;
    currentSessionId?: string;
    setFullSize: React.Dispatch<React.SetStateAction<boolean>>;
    fullSize:boolean;
}

export default function Sidebar({
    userId,
    currentSessionId,
    fullSize,
    setFullSize
}: SidebarProps) {
    const [displayFriend, setDisplayFriend] = useState(false)
    const [displaySession, setDisplaySession] = useState(true)
    const [visible, setVisible] = useState(false)
    const { currentUser } = useAuth()
    const toggleNav = () => setFullSize(!fullSize);

    const { sessions, loading: sessionLoading, error: sessionError, sessionDetails } = useSessionsListener(currentUser?.uid)
    const { addASession } = useSession()
    const dispatch = useDispatch()
    // const userId = useSelector((state: RootState) => state.auth.user)

    // if (!Array.isArray(sessions) || sessions.length === 0) {
    //     return null; 
    // }
    
    // console.log('uid', userId)
    const handleNewChat = () => {
        if(!currentUser.uid) return
        dispatch(clearParticipants())
        dispatch(addToChat(true))
        addASession(currentUser.uid)
    }

    if (sessionLoading) return <Loading message={'Loading sessions...'} />

    return (
        <div className='fixed top-0 left-0 h-full z-10 border-solid border-r-sky-100'>
            <button
                onClick={toggleNav}
                className={`absolute top-1/2 z-30 bg-blue-500 text-white p-2 rounded-full 
                            transform -translate-y-1/2 transition-transform duration-300 ease-in-out
                            ${fullSize ? 'left-60' : 'left-0'}`}
                aria-label="Toggle Navigation"
            >
               {fullSize ? '<' : '>'}
            </button>
            <div className={`${fullSize ? 'translate-x-0' : '-translate-x-full'}
                absolute top-0 left-0 w-64 h-full bg-gray-800 text-white
                transition-transform duration-300 ease-in-out`}
            >
                <div className='flex flex-row justify-end items-center gap-2 mt-1'>
                    <SlOptions 
                        className="w-5 h-5 cursor-pointer"
                    />
                    {displayFriend ? (
                        <>
                            <BsList 
                                className="w-7 h-7 cursor-pointer"
                                onClick={() => {
                                    setDisplayFriend(false)
                                    setDisplaySession(true)
                                }}
                            />
                            <IoPersonAddSharp 
                                className="w-7 h-7 cursor-pointer"
                                onClick={() => setVisible(true)}
                            />
                        </>
                    ) : (
                        <>
                            <FaUserFriends 
                                className="w-7 h-7 cursor-pointer"
                                // style={{width:'40px', height:'40px'}} 
                                onClick={() => {
                                    setDisplayFriend(true)
                                    setDisplaySession(false)
                                }}
                            />
                            <BiSolidMessageAltEdit 
                                className="w-7 h-7 cursor-pointer"
                                onClick={() => dispatch(addToChat(true))}
                            />
                        </>
                    )}
                </div>
                <InputForm 
                    value={''} 
                    className={'w-7/8 mt-2'} 
                    placeholder={`Search ${displaySession ? 'messages' : 'contact'}`}
                />
                {/* <h4 className=''>Profile Icon</h4> */}
                {/* <div className='flex flex-row'>
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
                </div> */}
            </div>

            {/* <div className="flex-grow bg-gray-200"> */}
                {displayFriend ? (
                    <FriendList userId={userId!} visible={visible} setVisible={setVisible} />
                ): (
                    <SessionList 
                        handleAddNewSession={handleNewChat}
                        sessions={sessionDetails}
                        userId={currentUser.uid!}
                    />
                )}   
            {/* </div> */}
        </div>
    )
}
