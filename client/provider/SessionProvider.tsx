import React, { useState, ReactNode } from 'react';
import SessionContext from '@/context/SessionContext'
import { Friend } from '@/interfaces/Friend';
interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
    const [currentSession, setCurrentSession] = useState<string | null>(null);
    const [participants, setParticipants] = useState<Friend[]>([]);

    const addParticipant = (newParticipant: Friend) => {
        setParticipants(prevParticipants => [...prevParticipants, newParticipant]);
    };

    return (
        <SessionContext.Provider value={{ currentSession, participants, setCurrentSession, setParticipants, addParticipant }}>
            {children}
        </SessionContext.Provider>
    );
};
