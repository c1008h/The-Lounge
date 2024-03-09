import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onValue, ref, set, push } from 'firebase/database'; // Assuming using Firebase Realtime Database
import { sessionsRT } from '@/services/firebaseConfig';
import { Session } from '@/interfaces/Session';
import { useSocket } from '@/hooks/useSocket';
interface SessionContextType {
    sessions: Session[];
    addSession: () => void;
    deleteSession: (sessionId: string) => void;
    leaveSession: (sessionId: string) => void;
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

    const addSession = useCallback((session: Session) => {
        setSessions(prevSessions => [...prevSessions, session]);
        if (socket) socket.emit('addSession', session);
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
        const handleAddSession = (session: Session) => addSession(session);
        const handleRemoveSession = (sessionId: string) => deleteSession(sessionId);

        socket.on('sessionAdded', handleAddSession);
        socket.on('sessionRemoved', handleRemoveSession);

        return () => {
            socket.off('sessionAdded', handleAddSession);
            socket.off('sessionRemoved', handleRemoveSession);
        }
    }, [socket, addSession, deleteSession, leaveSession])
  
    return (
        <SessionContext.Provider value={{ sessions, addSession, deleteSession, leaveSession }}>
            {children}
        </SessionContext.Provider>
    );
};