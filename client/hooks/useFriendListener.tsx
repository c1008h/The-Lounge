import { useState, useEffect, useCallback } from 'react';
import { userCollection } from '@/services/firebaseConfig';
import { query, where, updateDoc, arrayRemove, getDocs, onSnapshot } from 'firebase/firestore';
import { Friend } from '@/interfaces/Friend';

export const useFriendListener = (userId: string) => {
    const [friends, setFriends] = useState<Friend[]>([]);
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
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.friends) {
                        friendsData.push(...userData.friends);
                    }
                });
                setFriends(friendsData);
                setLoading(false);
            })
    
            return () => unsubscribe();
        } catch (error) {
            setError(error instanceof Error ? error : new Error('Error fetching friends'));
        } finally {
            setLoading(false);
        }
    }, [userId])

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    return { friends, loading, error };
}