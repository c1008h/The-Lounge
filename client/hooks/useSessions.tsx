import { useState, useEffect, useCallback } from 'react';
import { db, userCollection } from '@/services/firebaseConfig';
import { doc, query, where, updateDoc, arrayRemove, getDocs } from 'firebase/firestore';

export const useSessions = (userId: string) => {
    const [sessions, setSessions] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchSessions = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (!userId) {
            setLoading(false)
            return;
        }
        try {
            const q = query(userCollection, where("uid", "==", userId))
            const querySnapshot = await getDocs(q)
    
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setSessions(userDoc.data().sessions)
            } else {
                console.log("No user found with the given UID.");
                setSessions([]);
            }
        } catch (error) {
            setError(error instanceof Error ? error : new Error('Error fetching sessions'));
        } finally {
            setLoading(false);
        }
    }, [userId])

    const deleteSession = async (sessionId: string) => {
        if (!userId || !sessionId) return;
        setLoading(true);

        try {
            const q = query(userCollection, where("uid", "==", userId))
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const userDocRef = querySnapshot.docs[0].ref;
                await updateDoc(userDocRef, {
                  sessions: arrayRemove(sessionId)
                });
                await fetchSessions(); 
            }
        } catch (error) {
            setError(error instanceof Error ? error : new Error('Error deleting session'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    return { sessions, loading, error, deleteSession };
}