'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import {CardTemplate, ButtonTemplate, FormTemplate, BoxTemplate, Error, InputForm, Loading} from '@/components'
import { useParticipants, useSession, useChat } from '@/context';
import { useSessionsListener, useParticipantsListener, useChatListener } from '@/hooks';
import { useAuth } from '@/provider/AuthProvider';
import Sidebar from './Sidebar';
import { Participant } from '@/interfaces/Participant';
import { addAParticipant, backspaceParticipant } from '@/features/participants/participantSlices';
import { selectParticipants } from '@/features/participants/participantSelectors';
import { RootState } from '@/features/store';

export default function Page() {
  const [message, setMessage] = useState<string>('') // ONE MESSAGE
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [uid, setUid] = useState<string>()
  const [addToChat, setAddToChat] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState('');

  const dispatch = useDispatch(); 
  const router = useRouter();

  const { currentUser } = useAuth();
  const participantList = useSelector((state: RootState) => state.participant.participants);

  const { addASession, deleteSession, leaveSession } = useSession()
  const { sessions, loading: sessionLoading, error: sessionError, sessionDetails } = useSessionsListener(currentUser?.uid || null)
  const { addParticipant, removeParticipant, removeSpecificParticipant } = useParticipants();
  const { participants, error: participantError } = useParticipantsListener(chatSessionId);
  const { sendMessage } = useChat()
  const { messages, error: chatError } = useChatListener(chatSessionId)

  useEffect(() => {
    if (currentUser) {
      setUid(currentUser.uid)
    } else if (!currentUser) {
      router.push('/login')
    }
    return () => {

    }
  }, [currentUser, router])

  console.log(`SESSIONS FROM USER ${uid}: ${sessions}`)
  console.log(`SESSIONS details from real time: ${sessionDetails}`)
  console.log(`Participants in this chat session ${chatSessionId}: ${participants}`)
  console.log("USER UID", uid)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value);
  
  const handleNewChat = () => {
    if(!uid) return
    
    setAddToChat(true);
    addASession(uid)
  }

  const handleAddParticipant = () => {
    const participantName = inputValue.trim();
    console.log("PART NAME:", participantName)
    // const isAlreadyAdded = participants.some(p => p.name === participantName);

    if (participantName) {
      const newParticipant = { uid: '1234', name: participantName};

      dispatch(addAParticipant(newParticipant));
      addParticipant(newParticipant);
      setInputValue(''); 
    }
  };

  const handleBackSpace = () => {
    dispatch(backspaceParticipant())
    removeParticipant()
  }

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
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-400	">
      <div className="flex flex-row flex-1 ">
        {/* LEFT SESSION NAVIGATION */}
        <Sidebar 
          sessions={sessionDetails}
          handleAddNewSession={handleNewChat}
        />
        {/* RIGHT SIDE OF SCREEN */}
        <div className="w-2/3 h-screen bg-gray-100 flex flex-col gap-4 relative">
          <div className='relative flex top-0 bg-slate-400 w-full h-24 justify-center items-center'>
            {addToChat ? (
              <div className='flex items-center flex-row bg-slate-400 text-white' >
                <label className='mr-2' htmlFor="participantInput">To: </label>
                {participantList && participantList.map((participant: Participant, index: number) => (
                  <div key={index} className='participant-block mr-2 mb-2 bg-gray-300 text-gray-700 p-2 rounded-lg flex items-center'>
                    {participant.name}
                  </div>
                ))}
                <input 
                  id="participantInput"
                  value={inputValue}
                  className='bg-slate-400 no-border outline-none'
                  onChange={(e) => setInputValue(e.target.value)} 
                  onKeyDown={(event) => { 
                    if (event.key === 'Enter' || event.key === ' ') {
                      handleAddParticipant(); 
                    } else if (event.key === 'Backspace' && !inputValue.trim()) {
                      // removeParticipant();
                      handleBackSpace()
                    }
                  }}
                />
                <ButtonTemplate
                  onPress={() => addASession()}
                  label={'+'}
                  // disabled={participants.length < 1 || participants == null}
                />
              </div>
            ) : (
              <h3 className='text-white'>To: {participants}</h3>
            )}
          </div>
            {/* {messages.map((message, index) => (
              <React.Fragment key={`message-${index}`}>
                <CardTemplate 
                  id={message.id}
                  message={message.message}
                  sender={message.sender}
                  timestamp={message.timestamp}
                  alignment={message.sender === uid ? 'right' : 'left'}
                />
              </React.Fragment>
            ))} */}
          
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
