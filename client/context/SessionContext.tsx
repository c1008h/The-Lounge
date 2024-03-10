import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'
import { onValue, ref, set, push } from 'firebase/database'; 
import { sessionsRT } from '@/services/firebaseConfig';
import { Session } from '@/interfaces/Session';
import { useSocket } from '@/hooks/useSocket';
interface SessionContextType {
    sessions: Session[];
    addASession: (uid: string) => void;
    deleteSession: (sessionId: string) => void;
    leaveSession: (sessionId: string) => void;
    currentSessionId: string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = (): SessionContextType => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const { socket } = useSocket()
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string>()
    const dispatch = useDispatch(); 

    const addASession = useCallback((uid: string) => {
        if (socket) socket.emit('addSession', uid);
    }, [socket])

    const deleteSession = useCallback((sessionId: string) => {
        setSessions(sessions.filter((s) => s.id !== sessionId));

        if (socket) socket.emit('deleteSession', sessionId);
    }, [socket, sessions])

    const leaveSession = useCallback((sessionId: string) => {
        setSessions(sessions.filter((s) => s.id !== sessionId));
        if (socket) socket.emit('leaveSession', sessionId);
    }, [socket, sessions])

    useEffect(() => {
        if (!socket) return
        const handleAddSession = (uid: string) => addASession(uid);
        const handleSessionAdded = (sessionId: string) => {
            console.log('SESSION ID RETURNED FROM SERVER:', sessionId)
            setCurrentSessionId(sessionId)
            dispatch(selectSessionToState(sessionId))
            setSessions(prevSessions => [
                ...prevSessions,
                { id: sessionId, participants: [], createdAt: new Date() }
            ]);
        }
        const handleRemoveSession = (sessionId: string) => deleteSession(sessionId);

        socket.on('sessionAdded', handleSessionAdded);
        socket.on('sessionRemoved', handleRemoveSession);

        return () => {
            socket.off('sessionAdded', handleSessionAdded);
            socket.off('sessionRemoved', handleRemoveSession);
        }
    }, [socket, addASession, deleteSession, leaveSession])
  
    return (
        <SessionContext.Provider value={{ sessions, addASession, deleteSession, leaveSession, currentSessionId }}>
            {children}
        </SessionContext.Provider>
    );
};