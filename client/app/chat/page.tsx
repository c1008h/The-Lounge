'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { MessageContainer, ButtonTemplate, MessageInput, Error, Loading, Navbar } from '@/components'
import { useSession, useMessage } from '@/hooks';
import { useSessionsListener, useChatListener, useFriendListener } from '@/hooks';
import { useAuth } from '@/provider/AuthProvider';
import { RootState } from '@/features/store';
import Name from './Name';

export default function Page() {
  // const [message, setMessage] = useState<string>('') 
  // const [uid, setUid] = useState<string>('')
  // const [displayName, setDisplayName] = useState<string>('')
  // const [filteredFriends, setFilteredFriends] = useState<Friend[]>([])

  // const dispatch = useDispatch(); 

  const { currentUser } = useAuth();
  // const participantList = useSelector((state: RootState) => state.participant.participants);
  // const activeSessionID = useSelector((state: RootState) => state.session.currentSession)

  // const { friends } = useFriendListener(currentUser?.uid)
  // const { addASession, deleteSession, leaveSession, currentSessionId } = useSession()

  // const { sendMessage } = useMessage()
  // const { messages, error: chatError } = useChatListener(activeSessionID)
  // console.log("CURRENT SESSION ID IN PAGE:", activeSessionID)

  // useEffect(() => {
  //   if (currentUser) {
  //     // console.log("USER STATE UID:", userState)
  //     console.log(typeof currentUser.uid)
  //     setUid(currentUser.uid)
  //   } else {
  //     router.push('/login')
  //   }
  //   return () => {

  //   }
  // }, [isAuthenticated, currentUser, userState, router])

  // useEffect(() => {
  //   if (inputValue.length > 2) {
  //     const lowercasedInput = inputValue.toLowerCase().trim()
  //     const filtered = friends.filter(friend =>
  //       friend.displayName?.toLowerCase().includes(lowercasedInput) ||
  //       friend.email?.toLowerCase().includes(lowercasedInput) ||
  //       friend.phoneNumber?.includes(inputValue.trim()) ||
  //       friend.uid.includes(inputValue.trim())
  //     )
  //     setFilteredFriends(filtered)
  //   } else {
  //     setFilteredFriends([])
  //   }
  // }, [inputValue, friends])
  

  // // const handleSendMessage = () => {
  // //   if (uid && activeSessionID ) {

  // //     console.log("Active session ID:", activeSessionID)
  // //     const messageData = {
  // //       message: message,
  // //       type:'message'
  // //       sender: { uid: uid, displayName: displayName },
  // //       timestamp: new Date().toISOString()
  // //     }
  
  // //     sendMessage(activeSessionID, messageData)
  // //   }
  // // }
  // const handleSelectFriend = (friend: Friend) => {
  //   if (activeSessionID) {
  //     const newParticipant = { 
  //       uid: friend.uid, 
  //       displayName: friend.displayName || null, 
  //       email: friend.email || null, 
  //       phoneNumber: friend.phoneNumber || null 
  //     };
  //     dispatch(addAParticipant(newParticipant));
  //     addParticipant(activeSessionID, newParticipant);
  //     setInputValue(''); // Clear input
  //     setFilteredFriends([]); // Clear filtered friends list
  //   }
  // };
  
  // // if (!currentUser) {
  // //   // return <Loading message={'Not logged in!'} />
  // //   router.push('/login')
  // if (authLoading) {
  //   return <Loading message={'Authenticating...'} />
  // } else if (sessionLoading) {
  //   return <Loading message={'Loading sessions...'} />
  // }

  // if (sessionError) {
  //   console.error(sessionError);
  //   return <Error message={'Error loading sessions. Please try again later.'} error={sessionError}/>
  // }
  
  return (
    <div>
      {/* <div className="flex flex-row flex-1"> */}
      {/* <div className="w-2/3 h-screen flex flex-col gap-4 relative"> */}
        <div className='relative flex top-0 w-full h-14 justify-center'>
          <Name />
          {/* {addToChat ? (
            <div className='flex items-center flex-row bg-slate-400 text-white' >
              <label className='mr-2' htmlFor="participantInput">To: </label>
              {participantList && participantList.map((participant: Participant, index: number) => (
                <div key={index} className='participant-block mr-2 mb-2 bg-gray-300 text-gray-700 p-2 rounded-lg flex items-center'>
                  <p>{participant.displayName ? participant.displayName : participant.email ? participant.email : participant.phoneNumber}</p>
                </div>
              ))}
              <input 
                id="participantInput"
                value={inputValue}
                className='bg-slate-400 no-border outline-none'
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={(event) => { 
                  if (event.key === 'Enter' || event.key === ' ') {
                    // handleAddParticipant(friend); 
                  } else if (event.key === 'Backspace' && !inputValue.trim()) {
                    // removeParticipant();
                    handleBackSpace()
                  }
                }}
              />
              {filteredFriends.length > 0 && (
                <div className="absolute bg-white border mt-1 max-h-60 overflow-auto z-10">
                  {filteredFriends.map(friend => (
                    <div className='' key={friend.uid} onClick={() => handleSelectFriend(friend)}>
                      <p>{friend.displayName ? friend.displayName : friend.email ? friend.email : friend.phoneNumber}</p>
                    </div>
                  ))}
                </div>
              )}
              <ButtonTemplate
                // onPress={() =>       
                //   // addParticipant(activeSessionID, newParticipant);
                // }
                label={'+'}
                // disabled={participants.length < 1 || participants == null}
              />
            </div>
          ) : (
            <h3 className='text-white'>To: {participants && participants.map(participant => participant.displayName).join(', ')}</h3>
          )} */}
        </div>
          {/* {messages && messages.map((message, index) => (
            <React.Fragment key={`message-${index}`}>
              <CardTemplate 
                id={message.id}
                message={message.message}
                sender={message.sender.displayName}
                timestamp={message.timestamp}
                alignment={message.sender === uid ? 'right' : 'left'}
              />
            </React.Fragment>
          ))} */}

        {/* <MessageContainer 
          messages={messages} 
          uid={currentUser?.uid}
          displayName={displayName}
        /> */}
        <div className="w-full flex fixed bottom-0 p-4 bg-gray-800">
          <MessageInput 
            // sendMessage={sendMessage}
            // sessionId={activeSessionID}
            uid={currentUser?.uid}
            // displayName={displayName}
          />
        </div>
      </div>
  );
}
