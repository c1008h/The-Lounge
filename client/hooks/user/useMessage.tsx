import { useCallback, useState, useEffect } from 'react';
import { useSocket } from '../useSocket'; 
import { Message } from '@/interfaces/Chat';

interface MessageProps {
    messages: Message[];
    sendMessage: (sessionId: string, message: Message) => void;
}

export const useMessage = (): MessageProps => {
    const { socket } = useSocket('user string');
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = useCallback((sessionId: string, newMessage: Message) => {
        if (socket) socket.emit('sendMessage', sessionId, newMessage);
    
    }, [socket]);

    useEffect(() => {
        if (!socket) return

        const handleReceiveMessage = (newMessage: Message) => {
            console.log('new message received:', newMessage)
            setMessages(prev => [...prev, newMessage]);
        };

        const handleNotification = (newMessage: Message) => {
            setMessages(prev => [...prev, newMessage]);
        }

        socket.on('sentMessage', handleReceiveMessage);
        socket.on('receivedNotification', handleNotification)

        return () => {
            socket.off('sentMessage', handleReceiveMessage);
            socket.off('receivedNotification', handleNotification)
        }

    }, [socket])

    return { messages, sendMessage };
};
