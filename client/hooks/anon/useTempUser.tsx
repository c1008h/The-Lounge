import { useCallback, useState, useEffect } from 'react';
import { useSocket } from '../useSocket'; 
import { TempUserProps, AddAnonSessionResponse } from '@/interfaces/TempUser';
import { useDispatch } from 'react-redux';
import { setDisplayName, setUid, storeSessionId, storeToken, clearSessionId } from '@/features/anon/anonSlices'
import { setUserSession } from '@/utils/anonSessions'
import { generateTempId } from '@/utils/generateTempId';

interface UseAnonSessionProps {
    currentSession: string;
    tempUser: TempUserProps | null;
    createSession: () => void;
    addUserToSession: (displayName: string, sessionId: string) => void;
    sessionToken: string;
}

export const useAnonSession = (): UseAnonSessionProps => {
    const { socket } = useSocket();
    const [currentSession, setCurrentSession] = useState('');
    const [sessionToken, setSessionToken] = useState<string>('') 
    const [tempUser, setTempUser] = useState<TempUserProps | null>(null);

    const dispatch = useDispatch(); 

    const createSession = useCallback(() => {
        if (socket) socket.emit('createAnonSession', 'create anon session for strangers')
        
    }, [socket]);

    const addUserToSession = useCallback((displayName: string, sessionId: string) => {
        return new Promise((resolve, reject) => {
            if (socket) {
                socket.emit('addAnonToSession', displayName, sessionId, (response:AddAnonSessionResponse) => {
                    if (response.error) {
                        reject(new Error('Failed to add anonymous user to session.'));
                    } else {
                        resolve({ displayName, uid: response.uid });
                    }
                });
            } else {
                reject(new Error('Socket not available.'));
            }
        });
    }, [socket]);

    useEffect(() => {
        if (sessionToken && currentSession && tempUser) {
            console.log("Updating session storage with:", sessionToken, currentSession, tempUser);
            setUserSession(sessionToken, currentSession, tempUser.uid, tempUser.displayName);
        }
    }, [sessionToken, currentSession, tempUser]);

    useEffect(() => {
        if (!socket) return

        const handleCreateAnonSession = (tempSession: string) => {
            const tempSessionId = generateTempId()
            dispatch(storeSessionId(tempSessionId));
            console.log('temp session', tempSession)
            
            setCurrentSession(tempSession);
            console.log("TEMPSESSION:", tempSessionId)
            setSessionToken(tempSessionId);
        }

        const handleAddToAnon = (uid: string, displayName: string) => {
            console.log('returned temp user id:', uid)
            console.log('returned temp user display name:', displayName)

            dispatch(setDisplayName(displayName))
            dispatch(setUid(uid))
            
            setTempUser({ 
                displayName: displayName,
                uid: uid
            })

        }

        socket.on('anonSessionCreated', handleCreateAnonSession)
        socket.on('anonAddedToSession', handleAddToAnon)

        return () => {
            socket.off('anonSessionCreated', handleCreateAnonSession)
            socket.off('anonAddedToSession', handleAddToAnon)
        }

    }, [socket])

    return { currentSession, createSession, addUserToSession, tempUser, sessionToken };
};
