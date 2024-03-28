import { useCallback, useState, useEffect } from 'react';
import { useSocket } from '../useSocket'; 
import { Message } from '@/interfaces/Chat';

interface AnonMessageProps {
    messages: Message[];
    sendAnonMessage: (sessionId: string, message: Message) => void;
}

export const useAnonMessage = (): AnonMessageProps => {
    const { socket } = useSocket(process.env.PUBLIC_NEXT_ANON_TOKEN || '');
    const [messages, setMessages] = useState<Message[]>([]);

    const sendAnonMessage = useCallback((sessionId: string, newMessage: Message) => {
        // console.log('new message sent:', newMessage)
        // setMessages(prev => [...prev, newMessage]);
        if (socket) socket.emit('sendAnonMessage', sessionId, newMessage);
    
    }, [socket]);

    useEffect(() => {
        if (!socket) return

        // const handleSendAnonMessage = (sessionId: string, msg: Message) => sendAnonMessage(sessionId, msg)
        const handleReceiveAnonMessage = (newMessage: Message) => {
            console.log('new message received:', newMessage)
            setMessages(prev => [...prev, newMessage]);
        };

        const handleNotification = (newMessage: Message) => {
            setMessages(prev => [...prev, newMessage]);
        }

        // socket.on('sentAnonMessage', handleSendAnonMessage)
        socket.on('receiveAnonMessage', handleReceiveAnonMessage);
        socket.on('receivedNotification', handleNotification)

        return () => {
            // socket.off('sentAnonMessage', handleSendAnonMessage)
            socket.off('receiveAnonMessage', handleReceiveAnonMessage);
            socket.off('receivedNotification', handleNotification)
        }
    }, [socket])

    return { messages, sendAnonMessage };
};
