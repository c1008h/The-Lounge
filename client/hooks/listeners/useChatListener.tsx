import {useState, useEffect} from 'react';
import { sessionsRT } from '@/services/firebaseConfig';
import { onValue, child, DatabaseReference, Unsubscribe } from "firebase/database";
import { Message } from '@/interfaces/Chat';
import { useSession } from '@/context/SessionContext';

export const useChatListener = () => {
    const { currentSession } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);

    // console.log("SESSION ID INSIDE MESSAGE LISTENER:", sessionId)
    useEffect(() => {
        const messageRef: DatabaseReference = child(sessionsRT, `${currentSession}/messages`)

        const handleData = (snapshot: any) => {
            if (snapshot.exists()) {
                const messagesData: Record<string, Message> = snapshot.val()
                const messageArray = Object.values(messagesData)
                setMessages(messageArray)
                setError(null);
            } else {
                setMessages([]);
                setError('No messages found.');
            }
        }

        const unsubscribe: Unsubscribe = onValue(messageRef, handleData)

        return () => {
            unsubscribe()
        }
        
    }, [currentSession])

    return { messages, error };
}

