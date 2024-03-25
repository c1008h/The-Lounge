import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'
import { Session } from '@/interfaces/Session';
import { useSocket } from '@/hooks/useSocket';
import { TempUserProps, defaultTempUser } from '@/interfaces/TempUser'

interface AnonContextType {
    currentSessionId: string;
}

const AnonContext = createContext<AnonContextType | undefined>(undefined);

export const useAnon = (): AnonContextType => {
    const context = useContext(AnonContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}

export const AnonProvider = ({ children }: { children: ReactNode }) => {
    const [currentSessionId, setCurrentSessionId] = useState<string>('')
    const dispatch = useDispatch(); 

    return (
        <AnonProvider.Provider value={{ currentSessionId }}>
            {children}
        </AnonProvider.Provider>
    );
};