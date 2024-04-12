import { useCallback, useState, useEffect } from 'react';
import { Message } from '@/interfaces/Chat';
import { useSocketContext } from '@/provider/SocketProvider';
interface MessageProps {
    messages: Message[];
    sendMessage: (sessionId: string, message: Message) => void;
}

export const useMessage = (): MessageProps => {
    const socket = useSocketContext();

    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = useCallback((sessionId: string, newMessage: Message) => {
        if (socket?.socket) socket.socket.emit('sendMessage', sessionId, newMessage);
    
    }, [socket]);

    useEffect(() => {
        if (!socket || !socket.socket) return;

        const handleReceiveMessage = (newMessage: Message) => {
            console.log('new message received:', newMessage)
            setMessages(prev => [...prev, newMessage]);
        };

        const handleNotification = (newMessage: Message) => {
            setMessages(prev => [...prev, newMessage]);
        }

        socket.socket.on('sentMessage', handleReceiveMessage);
        socket.socket.on('receivedNotification', handleNotification)

        return () => {
            if (!socket || !socket.socket) return;
            socket.socket.off('sentMessage', handleReceiveMessage);
            socket.socket.off('receivedNotification', handleNotification)
        }

    }, [socket])

    return { messages, sendMessage };
};
