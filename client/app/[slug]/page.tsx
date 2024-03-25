"use client"
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ButtonTemplate, ModalTemplate, InputForm, Loading, MessageInput, MessageContainer } from '@/components';
import { TempUserProps } from '@/interfaces/TempUser';
import { setUserSession, getUserSession, clearUserSession } from '@/utils/anonSessions'
import { useAnonSession, useAnonMessage } from '@/hooks'
import { RootState } from '@/features/store';
import { storeSessionId } from '@/features/anon/anonSlices';

export default function Anon({ params }: { params: { slug: string } }) {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [anonUser, setAnonUser] = useState<TempUserProps>()
  const [displayName, setDisplayName] = useState<string>('')
  const [isSessionDeleted, setIsSessionDeleted] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const { 
    createSession, 
    currentSession, 
    tempUser, 
    addUserToSession, 
    sessionToken, 
    removeAnon 
  } = useAnonSession()

  const storedSessionId = useSelector((state: RootState) => state.anon.anonSessionId)
  const storedDisplayName = useSelector((state: RootState) => state.anon.displayName)
  const storedTempUid = useSelector((state: RootState) => state.anon.uid)
  const storedToken = useSelector((state: RootState) => state.anon.accessToken)
  const participantCount = useSelector((state: RootState) => state.anon.participantsActive)

  const { sendAnonMessage, messages } = useAnonMessage()
  // const { removeAnon } = useParticipants()

  console.log('participant count:', participantCount)
  // console.log('participant count type:', typeof participantCount)


  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    const currentParam = params.slug
    console.log('current param:', currentParam)
    
    const initiateChatSession = async () => {
      await createSession(params.slug); 
      
      if (storedSessionId) {
        setLoading(false); 
      } else {
        router.push('/error'); 
      }
    };

    if (!storedSessionId) {
      dispatch(storeSessionId(currentParam))
    } else {
      initiateChatSession();
    }

  }, []);

  useEffect(() => {
    setShowModal(true)
  }, [])

  useEffect(() => {
    if (storedSessionId && storedDisplayName && storedTempUid) {
      console.log("temp user:", tempUser)
      setUserSession(storedSessionId, params.slug, storedTempUid, storedDisplayName, )
      setAnonUser({ displayName: storedDisplayName, uid: storedTempUid })
      setShowModal(false) 
    } 
  }, [storedSessionId, storedDisplayName, storedTempUid])


  useEffect(() => {
    if (participantCount == 0 || !anonUser || !anonUser.uid) return

    const handleLeave = () => {
      clearUserSession(sessionToken)
      // removeAnon(anonUser.uid, params.slug, participantCount)
    }

    window.addEventListener('beforeunload', handleLeave)

    return () => window.removeEventListener('beforeunload', handleLeave);
  }, [removeAnon, anonUser, params.slug, participantCount])

  const copyLinkToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/${currentSession}`)
      .then(() => {
        setIsLinkCopied(true);
        setTimeout(() => {
          setIsLinkCopied(false);
        }, 2000);
      })
      .catch(err => console.error('Could not copy text: ', err));
    }
  };

  if (isSessionDeleted) {
    router.push('/');
    return null; 
  }
  
  const handleAddUser = async () => {
    try {
      setShowError(false)
      setLoading(true)

      addUserToSession(displayName, params.slug)

      console.log('temp user in page file:', tempUser)

      if (storedTempUid && storedDisplayName) {
        setShowModal(false)
      } else {
        setShowError(true)
      }
    } catch (error) {
      console.error("Error adding user:", error)
      setShowError(true);
    } finally {
      setLoading(false)
    }
  }

  if (showModal) {
    return (
      <ModalTemplate
        label="Welcome to the super secret chatting website"
        onClose={() => setShowModal(false)}
        visible={showModal}
      >
        <div className='flex flex-row items-center'>
          <InputForm onValueChange={(value: string) => setDisplayName(value)} value={displayName} placeholder={'Enter your name'}/>
        </div>
        {showError && <p>Error saving. Try again!</p>}
        <ButtonTemplate 
          label='Save' 
          className='justify-center' 
          onPress={handleAddUser}
          disabled={displayName.trim().length <= 3}
        />
      </ModalTemplate>)
  }

  if (loading) return <Loading message={'Loading chat...'} />
  
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4 flex justify-between flex-col">
        <div className='flex flex-row justify-between'>
          <div>Chat Room</div>
          <div>{participantCount} {participantCount === 1 ? 'person' : 'people'} in the chat</div>
        </div>
        <div>
          {/* Instructions for sharing the chatroom link */}
          Share this link with friends to chat: {`${window.location.origin}/${params.slug}`}
          <button onClick={copyLinkToClipboard} className="ml-2 px-2 py-1 bg-gray-600 text-white rounded-md">{isLinkCopied ? 'Copied!' : 'Copy Link'}</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          <MessageContainer 
            messages={messages} 
            uid={storedTempUid}
            displayName={storedDisplayName}
          />
        </div>
      </div>
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <MessageInput 
          sendMessage={sendAnonMessage}
          sessionId={params.slug}
          uid={storedTempUid}
          displayName={storedDisplayName}
        />
      </div>
    </div>
  )
}
