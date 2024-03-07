import { useState, useEffect, useCallback } from 'react';
import { userCollection, sessionsRT } from '@/services/firebaseConfig';
import { query, where, updateDoc, arrayRemove, getDocs } from 'firebase/firestore';
import { ref, get, onValue } from 'firebase/database';

export const useSessions = (userId: string) => {
    const [sessions, setSessions] = useState<string[]>([]);
    const [sessionDetails, setSessionDetails] = useState<any[]>([]); 
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    // const fetchSessionsDetails = async (sessionIds: string[]) => {
    //     setLoading(true);
    //     setError(null);

    //     try {
    //         const sessionsPromises = sessionIds.map(async (sessionId) => {
    //             const sessionRef = ref(sessionsRT, sessionId);
    //             console.log("Session ref:", sessionRef); 

    //             const snapshot = await get(sessionRef);

    //             if (snapshot.exists()) {
    //                 const sessionData = snapshot.val();
    //                 const latestMessage = sessionData.messages ? sessionData.messages[sessionData.messages.length - 1] : null;

    //                 const sessionDetails = {
    //                     sessionId,
    //                     latestMessage,
    //                     participants: sessionData.participants
    //                 };

    //                 return sessionDetails;
    //             }
    //         })
    //         const resolvedSessions = await Promise.all(sessionsPromises);
    //         const filteredSessions = resolvedSessions.filter(session => session !== null);
    //         setSessionDetails(filteredSessions);
    //     } catch (error) {
    //         setError(error instanceof Error ? error : new Error('Error fetching session details'));
    //     } finally {
    //         setLoading(false)
    //     }
    // }

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


    useEffect(() => {
        if (!userId) return;

        const unsubscribe = onValue(sessionsRT, (snapshot) => {
            const sessionData = snapshot.val();
            console.log("SESSSION DATA:", sessionData)

            if (sessionData) {
                const updatedSessionDetails = Object.keys(sessionData).map((sessionId) => {
                    const session = sessionData[sessionId];
                    console.log("SESSSSSIONS:", session)
                    const latestMessage = session.messages ? session.messages[session.messages.length - 1] : null;
                    return {
                        sessionId,
                        latestMessage,
                        participants: session.participants
                    };
                });
                console.log("UPDATED SESSION DETAILS", updatedSessionDetails)
                setSessionDetails(updatedSessionDetails);
            } else {
                setSessionDetails([]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [userId]);

    return { sessions, loading, error, deleteSession, sessionDetails };
}