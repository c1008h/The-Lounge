import { useState, useEffect, useCallback } from 'react';
import { userCollection, sessionsRT } from '@/services/firebaseConfig';
import { query, where, updateDoc, arrayRemove, getDocs } from 'firebase/firestore';
import { ref, get, onValue } from 'firebase/database';

export const useSessionsListener = (userId: string) => {
    const [sessions, setSessions] = useState<string[]>([]);
    const [sessionDetails, setSessionDetails] = useState<any[]>([]); 
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

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);


    useEffect(() => {
        if (!userId) return;

        const unsubscribe = onValue(sessionsRT, (snapshot) => {
            const sessionData = snapshot.val();
            console.log("SESSSION DATA:", sessionData)

            if (sessionData) {
                // const updatedSessionDetails = Object.keys(sessionData).map((sessionId) => {
                //     const session = sessionData[sessionId];
                //     console.log("SESSSSSIONS:", session)
                //     const latestMessage = session.messages ? session.messages[session.messages.length - 1] : null;
                //     return {
                //         sessionId,
                //         latestMessage,
                //         participants: session.participants
                //     };
                // });
                const updatedSessionDetails = sessions.map(sessionId => {
                    const lastMessage = sessionData[sessionId]?.messages
                        ? sessionData[sessionId].messages[sessionData[sessionId].messages.length - 1]
                        : null;
                    const timestamp = lastMessage ? lastMessage.timestamp : null;
                    return {
                        sessionId, 
                        lastMessage,
                        timestamp,
                        participants: sessionData[sessionId]?.participants || []
                    }
                })
                console.log("UPDATED SESSION DETAILS", updatedSessionDetails)
                setSessionDetails(updatedSessionDetails);
            } else {
                setSessionDetails([]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [userId, sessions]);

    return { sessions, loading, error, sessionDetails };
}