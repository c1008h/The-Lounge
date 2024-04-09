import { useState, useEffect, useCallback } from 'react';
import { userCollection } from '@/services/firebaseConfig';
import { query, where, updateDoc, arrayRemove, getDocs, onSnapshot } from 'firebase/firestore';
import { Friend } from '@/interfaces/Friend';

export const useFriendListener = (userId: string) => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
    const [pendingFriends, setPendingFriends] = useState<Friend[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchFriends = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (!userId) {
            setLoading(false)
            return;
        }
        
        try {
            const q = query(userCollection, where("uid", "==", userId))
            
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const friendsData: Friend[] = []
                const friendRequestsData: Friend[] = [];
                const pendingFriendsData: Friend[] = [];

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.friends) {
                        friendsData.push(...userData.friends);
                    }
                    if (userData.friendRequests) {
                        friendRequestsData.push(...userData.friendRequests);
                    }
                    if (userData.sentFriendRequests) {
                        pendingFriendsData.push(...userData.sentFriendRequests);
                    }
                });

                console.log("FRIENDS:", friends)
                console.log("FRIEND REQUEST DATA:", friendRequestsData)
                console.log("PENDING FRIEND DATA:", pendingFriendsData)

                setFriends(friendsData);
                setFriendRequests(friendRequestsData);
                setPendingFriends(pendingFriendsData);
                setLoading(false);
            })
    
            return () => unsubscribe();
        } catch (error) {
            setError(error instanceof Error ? error : new Error('Error fetching friends'));
            setLoading(false);
        } 
    }, [userId, setFriends, setFriendRequests, setPendingFriends, setLoading, setError]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    return { friends, friendRequests, pendingFriends, loading, error };
}