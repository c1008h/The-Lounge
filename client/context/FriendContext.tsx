import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Friend } from '@/interfaces/Friend';
import { useSocket } from '@/hooks/useSocket';
interface FriendContextType {
    friends: Friend[];
    searchFriend: (friendId: string) => void;
    addAFriend: (userId: string, friend: Friend) => void;
    deleteAFriend: (userId: string, friendId: string) => void;
    isFriendFound: Friend | null;
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
    const [isFriendFound, setIsFriendFound] = useState<Friend | null>(null)
    const dispatch = useDispatch(); 

    const searchFriend = useCallback((friendId: string) => {
        console.log("user input friend search:", friendId)
        if (socket) socket.emit('searchFriend', friendId)
    }, [socket])

    const addAFriend = useCallback((userId: string, friend: Friend) => {
        if (socket) socket.emit('addFriend', userId, friend);
    }, [socket])

    const deleteAFriend = useCallback((userId: string, friendId: string) => {
        setFriends(friends.filter((f) => f.uid !== friendId));

        if (socket) socket.emit('deleteFriend', friendId);
    }, [socket])

    useEffect(() => {
        if (!socket) return

        const handleFriendFound = (friendId: Friend) => {
            setIsFriendFound(friendId)
        }
        
        const handleFriendAdded = (userId: string, friend: Friend) => {
            // dispatch(selectSessionToState(sessionId))
            const newFriend = {
                uid: friend.uid, 
                name: friend.name || null, 
                displayName: friend.displayName || null, 
                email: friend.email || null,
                phoneNumber: friend.phoneNumber || null,
                pending: true
            }

            setFriends(prevFriends => [
                ...prevFriends,
                newFriend
            ]);
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