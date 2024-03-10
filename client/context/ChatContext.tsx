import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Message } from '@/interfaces/Chat'
import { useSocket } from '@/hooks/useSocket';

interface ChatContextType {
  messages: Message[];
  sendMessage: (sessionId: string, message: Message) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback((sessionId: string, newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
    if (socket) socket.emit('sendMessage', sessionId, newMessage);

  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleSendMessage = (sessionId: string, msg: Message) => sendMessage(sessionId, msg)

    socket.on('sentMessage', handleSendMessage)

    return () => {
      socket.off('sentMessage', handleSendMessage)
    }
  }, [socket, sendMessage])

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
