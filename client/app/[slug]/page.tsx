"use client"
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ButtonTemplate, ModalTemplate, InputForm, Loading, MessageInput, MessageContainer } from '@/components';
import { TempUserProps } from '@/interfaces/TempUser';
import { setUserSession, clearUserSession } from '@/utils/anonSessions'
import { useAnonSession, useAnonMessage } from '@/hooks'
import { RootState } from '@/features/store';
import { storeSessionId, clearSessionId } from '@/features/anon/anonSlices';

export default function Anon({ params }: { params: { slug: string } }) {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [anonUser, setAnonUser] = useState<TempUserProps>()
  const [displayName, setDisplayName] = useState<string>('')
  const [isSessionDeleted, setIsSessionDeleted] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const { createSession, currentSession, tempUser, addUserToSession, sessionToken, removeAnon } = useAnonSession()

  const storedSessionId = useSelector((state: RootState) => state.anon.anonSessionId)
  const storedDisplayName = useSelector((state: RootState) => state.anon.displayName)
  const storedTempUid = useSelector((state: RootState) => state.anon.uid)
  const participantCount = useSelector((state: RootState) => state.anon.participantsActive)

  const { sendAnonMessage, messages } = useAnonMessage()

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    const currentParam = params.slug    
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
    if (!storedDisplayName || !storedTempUid || typeof window === 'undefined') return

    const handleLeave = () => {
      clearUserSession(sessionToken)
      removeAnon(storedTempUid, storedDisplayName, params.slug)
    }

    window.addEventListener('beforeunload', handleLeave)

    return () => window.removeEventListener('beforeunload', handleLeave);
  }, [removeAnon, storedTempUid, params.slug, storedDisplayName])

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
      setErrorMessage('')
      setLoading(true)

      addUserToSession(displayName, params.slug)

      console.log('temp user in page file:', tempUser)
      if (storedTempUid && storedDisplayName) {
        setShowModal(false)
      } else {
        setShowError(true)
        setErrorMessage("Error saving. Try again!")
      }
    } catch (error) {
      console.error("Error adding user:", error)
      setShowError(true);
      setErrorMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async () => {
    dispatch(clearSessionId())
    router.replace('/')
  }

  if (showModal) {
    return (
      <ModalTemplate
        label="Welcome to the super secret chatting website"
        onClose={() => setShowModal(false)}
        visible={showModal}
      >
        <form 
          className='flex flex-col items-center justify-center w-full mx-auto my-0'       
          onSubmit={(e) => {
            e.preventDefault(); 
            if (displayName.length > 3) {
              setShowError(false)
              handleAddUser();
            } else {
              setShowError(true)
              setErrorMessage("Display name must be longer than 3 characters.")
            }
          }}
        >
          <InputForm onValueChange={(value: string) => setDisplayName(value)} value={displayName} placeholder={'Enter your name'}/>
          {showError && <p>{errorMessage}</p>}
          <ButtonTemplate 
            label='Save' 
            className='justify-center w-full' 
            onPress={handleAddUser}
            disabled={displayName.trim().length <= 3}
          />
        </form>
      </ModalTemplate>)
  }

  if (loading) return <Loading message={'Loading chat...'} />
  
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4 flex justify-between flex-col">
        <div className='flex flex-row justify-between'>
          <div className='text-2xl font-bold text-white md:text-3xl lg:text-4xl'>The Lounge</div>
          <div>
            {participantCount} {participantCount === 1 ? 'person' : 'people'} in the lounge
          </div>
        </div>
        <div className='flex flex-row justify-between'>
          <div>
            Share this link with friends to join: {`${window.location.origin}/${params.slug}`}
            <ButtonTemplate onPress={copyLinkToClipboard} className="ml-2 px-2 py-1 bg-gray-600 text-white rounded-md" label={isLinkCopied ? 'Copied!' : 'Copy Link'} />
          </div>
          <ButtonTemplate onPress={handleLeave} className='ml-4 px-2 py-1 bg-red-600 text-white rounded-md' label='Leave'/>
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
