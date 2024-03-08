import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onValue, ref, set, push } from 'firebase/database'; // Assuming using Firebase Realtime Database
import { io } from "socket.io-client";
import { sessionsRT } from '@/services/firebaseConfig';

interface ChatSession {
    id: string;
    participants: string[]; 
    createdAt: Date;
}
  
interface SessionContextType {
    sessions: ChatSession[];
    createSession: (participants: string[]) => Promise<void>;
    joinSession: (sessionId: string) => Promise<void>;
    leaveSession: (sessionId: string) => Promise<void>;
}

if (typeof process.env.NEXT_PUBLIC_SOCKET_PORT === 'undefined') throw new Error('NEXT_PUBLIC_SOCKET_PORT is not defined');
const socket = io(process.env.NEXT_PUBLIC_SOCKET_PORT);

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // Implementation for joinSession
  const joinSession = async (sessionId: string): Promise<void> => {
    // Implement your logic for joining a session
  };

  // Implementation for leaveSession
  const leaveSession = async (sessionId: string): Promise<void> => {
    // Implement your logic for leaving a session
  };

  const createSession = async (participants: string[]): Promise<void> => {
    const newSessionRef = push(ref(sessionsRT, 'sessions'));
    await set(newSessionRef, {
      participants,
      createdAt: serverTimestamp(), // Use Firebase server timestamp for consistency
    });
    socket.emit('newSessionCreated', { /* session details */ });
  };

  useEffect(() => {
    listenForSessions();
    // Setup socket listeners
    socket.on('newSession', (sessionData) => {
      setSessions(prevSessions => [...prevSessions, sessionData]);
    });

    return () => {
      // Cleanup listeners
      socket.off('newSession');
    };
  }, [listenForSessions]);

  const listenForSessions = useCallback(() => {
    const sessionsRef = ref(sessionsRT, 'sessions');
    onValue(sessionsRef, (snapshot) => {
      const updatedSessions: ChatSession[] = [];
      snapshot.forEach(childSnapshot => {
        const session = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        updatedSessions.push(session);
      });
      setSessions(updatedSessions);
    });
  }, []);

  return (
    <SessionContext.Provider value={{ sessions, createSession, joinSession, leaveSession }}>
      {children}
    </SessionContext.Provider>
  );
};