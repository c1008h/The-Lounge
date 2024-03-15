import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'
import { Session } from '@/interfaces/Session';
import { useSocket } from '@/hooks/useSocket';
interface SessionContextType {
    sessions: Session[];
    addASession: (uid: string) => void;
    deleteSession: (sessionId: string, userId: string) => void;
    leaveSession: (sessionId: string) => void;
    selectSession: (sessionId: string) => void;
    currentSessionId: string;
    createAnonSession: () => void;
    currentAnonSessionId: string;

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
    const [currentAnonSessionId, setCurrentAnonSessionId] = useState<string>()
    const dispatch = useDispatch(); 

    const createAnonSession = useCallback(() => {
        if (socket) socket.emit('createAnonSession', 'create anon session for strangers')
    }, [socket])

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

        const handleCreateAnonSession =(tempSession: string, tempUser: string) => {
            console.log('handle creaing anon session')
            setCurrentAnonSessionId(tempSession);

            // return tempSession
        }


        socket.on('sessionAdded', handleSessionAdded);
        socket.on('sessionRemoved', handleRemoveSession);
        socket.on('leaveSession', handleRemoveSession)
        socket.on('anonSessionCreated', handleCreateAnonSession)

        return () => {
            socket.off('sessionAdded', handleSessionAdded);
            socket.off('sessionRemoved', handleRemoveSession);
            socket.off('sessionLeft', handleRemoveSession)
            socket.off('anonSessionCreated', handleCreateAnonSession)

        }
    }, [socket, dispatch, deleteSession, leaveSession])
  
    return (
        <SessionContext.Provider value={{ sessions,  addASession, deleteSession, leaveSession, currentSessionId, currentAnonSessionId, selectSession, createAnonSession }}>
            {children}
        </SessionContext.Provider>
    );
};