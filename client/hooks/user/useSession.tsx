import { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Session } from '@/interfaces/Session';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'
import { useSocketContext } from '@/context/SocketContext';
interface SessionProps {
    sessions: Session[];
    addASession: (uid: string) => void;
    deleteSession: (sessionId: string, userId: string) => void;
    leaveSession: (sessionId: string) => void;
    selectSession: (sessionId: string) => void;
    currentSessionId: string;
}

export const useSession = (): SessionProps => {
    const socket = useSocketContext();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string>('')
    const dispatch = useDispatch(); 

    const addASession = useCallback((uid: string) => {
        if (socket?.socket) socket.socket.emit('addSession', uid);
    }, [socket])

    const deleteSession = useCallback((sessionId: string, userId: string) => {
        setSessions(sessions.filter((s) => s.id !== sessionId));

        if (socket?.socket) socket.socket.emit('deleteSession', sessionId, userId);
    }, [socket, sessions])

    const leaveSession = useCallback((sessionId: string) => {
        setSessions(sessions.filter((s) => s.id !== sessionId));
        if (socket?.socket) socket.socket.emit('leaveSession', sessionId);
    }, [socket, sessions])

    const selectSession = useCallback((sessionId: string) => {
        console.log('current sessnion in context:', sessionId)
        setCurrentSessionId(sessionId)
        dispatch(selectSessionToState(sessionId))
    }, [dispatch])

    useEffect(() => {
        if (!socket || !socket.socket) return;

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

        socket.socket.on('sessionAdded', handleSessionAdded);
        socket.socket.on('sessionRemoved', handleRemoveSession);
        socket.socket.on('leaveSession', handleRemoveSession)


        return () => {
            if (!socket || !socket.socket) return;

            socket.socket.off('sessionAdded', handleSessionAdded);
            socket.socket.off('sessionRemoved', handleRemoveSession);
            socket.socket.off('sessionLeft', handleRemoveSession)
        }
    }, [socket])

    return { sessions, addASession, deleteSession, leaveSession, currentSessionId, selectSession };
};
