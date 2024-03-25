import { useCallback, useState, useEffect } from 'react';
import { useSocket } from '../useSocket'; 
import { useDispatch } from 'react-redux';
import { Session } from '@/interfaces/Session';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'

interface SessionProps {
    sessions: Session[];
    addASession: (uid: string) => void;
    deleteSession: (sessionId: string, userId: string) => void;
    leaveSession: (sessionId: string) => void;
    selectSession: (sessionId: string) => void;
    currentSessionId: string;
}

export const useSession = (): SessionProps => {
    const { socket } = useSocket();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string>('')
    const dispatch = useDispatch(); 


    const addASession = useCallback((uid: string) => {
        if (socket) socket.emit('addSession', uid);
    }, [socket])

    const deleteSession = useCallback((sessionId: string, userId: string) => {
        setSessions(sessions.filter((s) => s.id !== sessionId));

        if (socket) socket.emit('deleteSession', sessionId, userId);
    }, [socket, sessions])

    const leaveSession = useCallback((sessionId: string) => {
        setSessions(sessions.filter((s) => s.id !== sessionId));
        if (socket) socket.emit('leaveSession', sessionId);
    }, [socket, sessions])

    const selectSession = useCallback((sessionId: string) => {
        console.log('current sessnion in context:', sessionId)
        setCurrentSessionId(sessionId)
        dispatch(selectSessionToState(sessionId))
    }, [dispatch])

    useEffect(() => {
        if (!socket) return
        // const handleAddSession = (uid: string) => addASession(uid);
        const handleSessionAdded = (sessionId: string) => {
            console.log('SESSION ID RETURNED FROM SERVER:', sessionId)
            setCurrentSessionId(sessionId)
            dispatch(selectSessionToState(sessionId))
            setSessions(prevSessions => [
                ...prevSessions,
                { id: sessionId, participants: [], createdAt: new Date() }
            ]);
        }
        const handleRemoveSession = (sessionId: string, userId: string) => deleteSession(sessionId, userId);

        socket.on('sessionAdded', handleSessionAdded);
        socket.on('sessionRemoved', handleRemoveSession);
        socket.on('leaveSession', handleRemoveSession)


        return () => {
            socket.off('sessionAdded', handleSessionAdded);
            socket.off('sessionRemoved', handleRemoveSession);
            socket.off('sessionLeft', handleRemoveSession)
        }
    }, [socket])

    return { sessions, addASession, deleteSession, leaveSession, currentSessionId, selectSession };
};
