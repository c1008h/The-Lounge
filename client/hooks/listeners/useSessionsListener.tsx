import { useState, useEffect, useCallback } from 'react';
import { userCollection, sessionsRT } from '@/services/firebaseConfig';
import { query, where, updateDoc, arrayRemove, getDocs } from 'firebase/firestore';
import { ref, get, onValue, child, DatabaseReference } from 'firebase/database';

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
        console.log("USER ID IN LISTENER:", userId)
        try {
            const q = query(userCollection, where("uid", "==", userId))
            const querySnapshot = await getDocs(q)
    
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();

                if (userData.sessions) {
                    console.log("user doc session data:", userData.sessions)
                    setSessions(userData.sessions)
                } else {
                    console.log("No active sessions.");
                }

            } else {
                console.log("No user found with the given UID.");
                setError(error instanceof Error ? error : new Error("No user found with the given UID."))
                setSessions([]);

            }
        } catch (error) {
            console.log("Error fetching sessions:", error)
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

            if (sessionData) {
                // Object.keys
                const updatedSessionDetails = Object.keys(sessionData).map(sessionId => {
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
                // console.log("UPDATED SESSION DETAILS", updatedSessionDetails)
                setSessionDetails(updatedSessionDetails);
            } else {
                setSessionDetails([]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [userId]);

    useEffect(() => {
        if (!sessions || sessions.length === 0) return;
        
        setSessionDetails(prevSessionDetails => {
            const updatedSessionDetails = prevSessionDetails.filter(session => sessions.includes(session.sessionId));
            return updatedSessionDetails;
        });
    }, [sessions]);

    return { sessions, loading, error, sessionDetails };
}