import { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Friend } from '@/interfaces/Friend';
import { useSocketContext } from '@/context/SocketContext';

interface FriendProps {
    friends: Friend[];
    searchFriend: (friendId: string) => void;
    addAFriend: (userId: string, friend: Friend) => void;
    deleteAFriend: (userId: string, friendId: string) => void;
    isFriendFound: Friend | undefined;
    successfullyAdded?: boolean | null;
    acceptFriendsRequest: (userId: string, friendId: string) => void;
    declineFriendRequest: (userId: string, friendId: string) => void;
    cancelFriendRequest: (userId: string, friendId: string) => void;
}

export const useFriend = (): FriendProps => {
    const socket = useSocketContext();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isFriendFound, setIsFriendFound] = useState<Friend | undefined>(undefined);
    const [successfullyAdded, setSuccessfullyAdded] = useState<boolean | null>(null)
    const dispatch = useDispatch(); 

    const searchFriend = useCallback((friendId: string) => {
        console.log("user input friend search:", friendId)
        if (socket?.socket) socket.socket.emit('searchFriend', friendId)
    }, [socket])

    const addAFriend = useCallback((userId: string, friend: Friend) => {
        if (socket?.socket) socket.socket.emit('addFriend', userId, friend);
    }, [socket])

    const deleteAFriend = useCallback((userId: string, friendId: string) => {
        setFriends(friends.filter((f) => f.uid !== friendId));

        if (socket?.socket) socket.socket.emit('deleteFriend', userId, friendId);
    }, [socket])

    const acceptFriendsRequest = useCallback((userId: string, friendId: string) => {
        console.log('accept friend request triggered in context')
        if (socket?.socket) socket.socket.emit('acceptFriendRequest', userId, friendId)
    }, [socket])

    const declineFriendRequest = useCallback((userId: string, friendId: string) => {
        if (socket?.socket) socket.socket.emit('declineFriendRequest', userId, friendId)
    }, [socket])

    const cancelFriendRequest = useCallback((userId: string, friendId: string) => {
        if (socket?.socket) socket.socket.emit('cancelFriendRequest', userId, friendId)
    }, [socket])

    useEffect(() => {
        if (!socket || !socket.socket) return;

        const handleFriendFound = (friendId: Friend) => {
            setIsFriendFound(friendId)
        }
        
        const handleFriendAdded = (result: boolean, userId: string, friend: Friend) => {
            // dispatch(selectSessionToState(sessionId))
            console.log('friend uid:', friend.uid)
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

            setSuccessfullyAdded(result)
        }
        const handleRemoveFriend = (userId: string, friendId: string) => deleteAFriend(userId, friendId);

        const handleAcceptFriendRequest = (result: boolean, userId: string, friendId: string) => {
            if (result) console.log("friend request accepted")
        }

        const handleDeclineFriendRequest = (result: boolean) => {
            if (result) console.log('friend request declined')
        }
        const handleCancelFriendRequest = (result: boolean) => {
            if (result) console.log('cancelled friend request')
        }

        socket.socket.on('friendFound', handleFriendFound)
        socket.socket.on('friendAdded', handleFriendAdded);
        socket.socket.on('friendRemoved', handleRemoveFriend);
        socket.socket.on('acceptedFriendRequest', handleAcceptFriendRequest)
        socket.socket.on('declinedFriendRequest', handleDeclineFriendRequest)
        socket.socket.on('canceledFriendRequest', handleCancelFriendRequest)

        return () => {
            if (!socket || !socket.socket) return;

            socket.socket.off('friendFound', handleFriendFound)
            socket.socket.off('friendAdded', handleFriendAdded);
            socket.socket.off('friendRemoved', handleRemoveFriend);
            socket.socket.off('acceptedFriendRequest', handleAcceptFriendRequest)
            socket.socket.off('canceledFriendRequest', handleCancelFriendRequest)
        }

    }, [socket])

    return { friends, searchFriend, addAFriend, deleteAFriend, isFriendFound, successfullyAdded, acceptFriendsRequest, declineFriendRequest, cancelFriendRequest };
};
