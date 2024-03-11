import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'
import { onValue, ref, set, push } from 'firebase/database'; 
import { Friend } from '@/interfaces/Friend';
import { useSocket } from '@/hooks/useSocket';

interface FriendContextType {
    friends: Friend[];
    addAFriend: (userId: string, friendId: string) => void;
    deleteAFriend: (userId: string, friendId: string) => void;
    // selectFriend: (userId: string, friendId: string) => void;

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
    const { socket } = useSocket()
    const [friends, setFriends] = useState<Friend[]>([]);
    const dispatch = useDispatch(); 

    const addAFriend = useCallback((userId: string, friendId: string) => {
        if (socket) socket.emit('addFriend', userId, friendId);
    }, [socket])

    const deleteAFriend = useCallback((userId: string, friendId: string) => {
        setFriends(friends.filter((f) => f.uid !== friendId));

        if (socket) socket.emit('deleteFriend', friendId);
    }, [socket])

    // const selectSession = useCallback((sessionId: string) => {
    //     setCurrentSessionId(sessionId)
    //     dispatch(selectSessionToState(sessionId))
    // }, [dispatch])

    useEffect(() => {
        if (!socket) return
        const handleFriendAdded = (userId: string, friendId: string) => {
            // dispatch(selectSessionToState(sessionId))
            setFriends(prevFriends => [
                ...prevFriends,
                { ...friendDetails, id: friendId }
            ]);
        }
        const handleRemoveFriend = (userId: string, friendId: string) => deleteAFriend(userId, friendId);

        socket.on('friendAdded', handleFriendAdded);
        socket.on('friendRemoved', handleRemoveFriend);

        return () => {
            socket.off('friendAdded', handleFriendAdded);
            socket.off('friendRemoved', handleRemoveFriend);
        }
    }, [socket, dispatch, addAFriend, deleteAFriend])
  
    return (
        <FriendContext.Provider value={{ friends, addAFriend, deleteAFriend }}>
            {children}
        </FriendContext.Provider>
    );
};