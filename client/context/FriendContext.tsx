import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'
import { onValue, ref, set, push } from 'firebase/database'; 
import { Friend } from '@/interfaces/Friend';
import { useSocket } from '@/hooks/useSocket';

interface User {
    email?: string;
    uid?: string;
    phoneNumber?: string;
}

interface FriendContextType {
    friends: Friend[];
    searchFriend: (friendId: string) => Friend | null;
    addAFriend: (userId: string, friendId: string) => void;
    deleteAFriend: (userId: string, friendId: string) => void;
    isFriendFound: User | null;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export const useFriend = (): FriendContextType => {
    const context = useContext(FriendContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}

export const FriendProvider = ({ children }: { children: ReactNode }) => {
    const { socket } = useSocket(); 
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isFriendFound, setIsFriendFound] = useState<Friend>()
    const dispatch = useDispatch(); 

    const searchFriend = useCallback((friendId: string) => {
        console.log("user input friend search:", friendId)
        if (socket) socket.emit('searchFriend', friendId)
    }, [socket])

    const addAFriend = useCallback((userId: string, friendId: string) => {
        if (socket) socket.emit('addFriend', userId, friendId);
    }, [socket])

    const deleteAFriend = useCallback((userId: string, friendId: string) => {
        setFriends(friends.filter((f) => f.uid !== friendId));

        if (socket) socket.emit('deleteFriend', friendId);
    }, [socket])

    useEffect(() => {
        if (!socket) return

        const handleFriendFound = (friendId: Friend) => {
            setIsFriendFound(friendId)
            return friendId
        }
        
        const handleFriendAdded = (userId: string, friendId: string) => {
            // dispatch(selectSessionToState(sessionId))
            const newFriend = {
                uid: friendId,
                displayName: isFriendFound.displayName || null,
                email: isFriendFound.email || null,
                phoneNumber: isFriendFound.phoneNumber || null,
                pending: true
            }

            setFriends(prevFriends => [...prevFriends, newFriend]);
        }
        const handleRemoveFriend = (userId: string, friendId: string) => deleteAFriend(userId, friendId);

        socket.on('friendFound', handleFriendFound)
        socket.on('friendAdded', handleFriendAdded);
        socket.on('friendRemoved', handleRemoveFriend);

        return () => {
            socket.off('friendFound', handleFriendFound)
            socket.off('friendAdded', handleFriendAdded);
            socket.off('friendRemoved', handleRemoveFriend);
        }
    }, [socket, dispatch, addAFriend, deleteAFriend])
  
    return (
        <FriendContext.Provider value={{ friends, searchFriend, addAFriend, deleteAFriend, isFriendFound }}>
            {children}
        </FriendContext.Provider>
    );
};