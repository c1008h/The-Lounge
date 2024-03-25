import { useCallback, useState, useEffect } from 'react';
import { useSocket } from '../useSocket'; 
import { TempUserProps, AddAnonSessionResponse } from '@/interfaces/TempUser';
import { useDispatch } from 'react-redux';
import { setDisplayName, setUid, storeSessionId, storeToken, clearSessionId, setParticipantCount } from '@/features/anon/anonSlices'
import { setUserSession } from '@/utils/anonSessions'
import { generateTempId } from '@/utils/generateTempId'

interface UseAnonSessionProps {
    currentSession: string;
    tempUser: TempUserProps | null;
    createSession: (tempSessionId: string) => void;
    addUserToSession: (displayName: string, sessionId: string) => void;
    sessionToken: string;
    removeAnon: (userId: string, displayName: string, sessionId: string) => void;
}

export const useAnonSession = (): UseAnonSessionProps => {
    const { socket, connect } = useSocket();
    const [currentSession, setCurrentSession] = useState('');
    const [sessionToken, setSessionToken] = useState<string>('') 
    const [tempUser, setTempUser] = useState<TempUserProps | null>(null);
    const dispatch = useDispatch(); 

    useEffect(() => {
        connect(); 

        return () => {
        // disconnect()
        };
    }, []);

    const createSession = useCallback((sessionId: string) => {
        if (socket) socket.emit('createAnonSession', sessionId)
        
    }, [socket]);

    const addUserToSession = useCallback((displayName: string, sessionId: string) => {
        const userId = generateTempId()

        dispatch(setDisplayName(displayName))
        dispatch(setUid(userId))
        
        setTempUser({ 
            displayName: displayName,
            uid: userId
        })

        return new Promise((resolve, reject) => {
            if (socket) {
                socket.emit('addAnonToSession', displayName, sessionId, userId, (response:AddAnonSessionResponse) => {
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

    const removeAnon = useCallback((userId: string, displayName: string, sessionId: string) => {
        if (socket) socket.emit('disconnectAnon', userId, displayName, sessionId);
        
    }, [socket])

    useEffect(() => {
        if (sessionToken && currentSession && tempUser) {
            console.log("Updating session storage with:", sessionToken, currentSession, tempUser);
            setUserSession(sessionToken, currentSession, tempUser.uid, tempUser.displayName);
        }
    }, [sessionToken, currentSession, tempUser]);

    useEffect(() => {
        if (!socket) return

        const handleCreateAnonSession = (tempSessionId: string) => {
            // const tempSessionId = generateTempId()
            dispatch(storeSessionId(tempSessionId));
            console.log('temp session', tempSessionId)
            
            setCurrentSession(tempSessionId);
            console.log("TEMPSESSION:", tempSessionId)
            setSessionToken(tempSessionId);
        }

        const handleAddToAnon = (user: string, sessionId: string, userId: string) => {
            console.log('returned temp user id:', userId)
            console.log('returned temp user display name:', user)
        }

        const updateRoomCount = (occupancy: number) => {
            console.log('occupancy:', occupancy)
            dispatch(setParticipantCount(occupancy))
        }

        const handleRemoveAnon = (userId: string, displayName: string, sessionId: string) => {
            // removeAnon(userId, sessionId, participant)
        }

        socket.on('anonSessionCreated', handleCreateAnonSession)
        socket.on('anonAddedToSession', handleAddToAnon)
        socket.on('roomOccupancyUpdate', updateRoomCount)
        socket.on('anonRemoved', handleRemoveAnon);
        socket.on('roomOccupancyUpdate', updateRoomCount)

        return () => {
            socket.off('anonSessionCreated', handleCreateAnonSession)
            socket.off('anonAddedToSession', handleAddToAnon)
            socket.off('roomOccupancyUpdate', updateRoomCount)
            socket.off('anonRemoved', handleRemoveAnon);
            socket.off('roomOccupancyUpdate', updateRoomCount)


        }

    }, [socket])

    return { currentSession, createSession, addUserToSession, tempUser, sessionToken, removeAnon };
};
