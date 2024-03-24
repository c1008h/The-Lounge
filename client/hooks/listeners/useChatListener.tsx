import {useState, useEffect} from 'react';
import { sessionsRT } from '@/services/firebaseConfig';
import { onValue, child, DatabaseReference, Unsubscribe } from "firebase/database";
import { Message } from '@/interfaces/Chat';

export const useChatListener = (sessionId: string) => {
    const [messages, setMessages] = useState<Message[] | null>([]);
    const [error, setError] = useState<string | null>(null);

    // console.log("SESSION ID INSIDE MESSAGE LISTENER:", sessionId)
    useEffect(() => {
        const messageRef: DatabaseReference = child(sessionsRT, `${sessionId}/messages`)

        const handleData = (snapshot: any) => {
            if (snapshot.exists()) {
                const messagesData: Record<string, Message> = snapshot.val()
                const messageArray = Object.values(messagesData)
                setMessages(messageArray)
                setError(null);
            } else {
                setMessages(null);
                setError('No messages found.');
            }
        }

        const unsubscribe: Unsubscribe = onValue(messageRef, handleData)

        return () => {
            unsubscribe()
        }
        
    }, [sessionId])

    return { messages, error };
}

