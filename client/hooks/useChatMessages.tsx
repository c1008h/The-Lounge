import {useState, useEffect} from 'react';
import { db, userCollection, sessionsRT } from '@/services/firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, onValue, child } from "firebase/database";

interface MessageProps {
    message: string;
    sender: string;
    time: number | Date;
}

interface ChatMessageProps {
    id: string;
    messages: MessageProps;
    participants: string[];
    createdAt: number | Date;
}

export const useChatMessages = (sessionId: string) => {
    const [messages, setMessages] = useState<ChatMessageProps[]>([]);

    useEffect(() => {
        if (sessionId) {
            const sessionMessagesRef = child(sessionsRT, `${sessionId}/messages`);
            const unsubscribe = onValue(sessionMessagesRef, (snapshot) => {
                const newMessages: ChatMessageProps[] = [];
                snapshot.forEach(childSnapshot => {
                    newMessages.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val(),
                    })
                })
                setMessages(newMessages)
            })

            return () => unsubscribe();
        } else {
            setMessages([])
        }
    }, [sessionId])

    return messages;
}