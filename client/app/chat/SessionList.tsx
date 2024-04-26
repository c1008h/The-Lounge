import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ButtonTemplate, BoxTemplate, Divider } from '@/components'
import { Session } from '@/interfaces/Session'
import { useParticipantsListener, useSession } from '@/hooks'
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'

interface SessionProps {
    // userId: string;
    sessionId: string;
    lastmessage: string;
    participants: string[];
    timestamp: Date | number | string;
}
interface SessionListProps {
    sessions: SessionProps[],
    handleAddNewSession: () => void;
    userId: string;
}
export default function SessionList({ userId, sessions, handleAddNewSession }: SessionListProps) {
    const { selectSession, deleteSession, leaveSession, currentSessionId } = useSession()
    const { participants } = useParticipantsListener();
    const dispatch = useDispatch(); 

    useEffect(() => {
        // console.log('sessions:', sessions)

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

    const handleDeleteSession = async (sessionId: string, userId: string) => {
        if (!sessionId) return
        deleteSession(sessionId, userId)
    }

    return (
        <>
            {/* <ButtonTemplate label='NEW CHAT' className='m-4' onPress={() => handleAddNewSession()}/> */}
            {!sessions ? (
                <>
                    <h2>No sessions available. Create session to get started!</h2>
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
        </>
    )
}
