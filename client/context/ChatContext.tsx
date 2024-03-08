import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeSession, fetchMessages, addMessage } from './chatService'; // Abstracted Firebase & Socket.IO logic
import { Session, Message, Participant } from './ChatTypes'; // Assuming you have defined these types

interface ChatContextType {
  session: Session | null;
  messages: Message[];
  participants: Participant[];
  addMessage: (message: Message) => void;
  // Add other relevant functions and state
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};

export const ChatProvider: React.FC = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Initialize session, fetch participants, etc. on component mount
  useEffect(() => {
    const init = async () => {
      const initialSession = await initializeSession(); // Placeholder function
      setSession(initialSession);
      // Assume fetchMessages and similar functions are real-time enabled
      fetchMessages(initialSession.id, setMessages); // This could set up a Firebase or Socket.IO listener
    };
    init();
  }, []);

  const addMessage = (newMessage: Message) => {
    addMessageToFirebaseOrEmitViaSocket(newMessage); // Placeholder function
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <ChatContext.Provider value={{ session, messages, participants, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
