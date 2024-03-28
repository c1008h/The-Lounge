import { useCallback, useState, useEffect } from 'react';
import { useSocket } from '../useSocket'; 
import { useDispatch } from 'react-redux';
import { Friend } from '@/interfaces/Friend';

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
    const { socket } = useSocket('user string');
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isFriendFound, setIsFriendFound] = useState<Friend | undefined>(undefined);
    const [successfullyAdded, setSuccessfullyAdded] = useState<boolean | null>(null)
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

        if (socket) socket.emit('deleteFriend', userId, friendId);
    }, [socket])

    const acceptFriendsRequest = useCallback((userId: string, friendId: string) => {
        console.log('accept friend request triggered in context')
        if (socket) socket.emit('acceptFriendRequest', userId, friendId)
    }, [socket])

    const declineFriendRequest = useCallback((userId: string, friendId: string) => {
        if (socket) socket.emit('declineFriendRequest', userId, friendId)
    }, [socket])

    const cancelFriendRequest = useCallback((userId: string, friendId: string) => {
        if (socket) socket.emit('cancelFriendRequest', userId, friendId)
    }, [socket])

    useEffect(() => {
        if (!socket) return

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

        socket.on('friendFound', handleFriendFound)
        socket.on('friendAdded', handleFriendAdded);
        socket.on('friendRemoved', handleRemoveFriend);
        socket.on('acceptedFriendRequest', handleAcceptFriendRequest)
        socket.on('declinedFriendRequest', handleDeclineFriendRequest)
        socket.on('canceledFriendRequest', handleCancelFriendRequest)

        return () => {
            socket.off('friendFound', handleFriendFound)
            socket.off('friendAdded', handleFriendAdded);
            socket.off('friendRemoved', handleRemoveFriend);
            socket.off('acceptedFriendRequest', handleAcceptFriendRequest)
            socket.off('canceledFriendRequest', handleCancelFriendRequest)
        }

    }, [socket])

    return { friends, searchFriend, addAFriend, deleteAFriend, isFriendFound, successfullyAdded, acceptFriendsRequest, declineFriendRequest, cancelFriendRequest };
};
