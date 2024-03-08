import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Participant {
  uid: string;
  name: string;
  // Add other participant properties as needed
}

interface ParticipantsContextType {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  removeParticipant: (uid: string) => void;
  // You can add more functions as needed, e.g., for real-time updates
}

const ParticipantsContext = createContext<ParticipantsContextType | undefined>(undefined);

export const useParticipants = (): ParticipantsContextType => {
  const context = useContext(ParticipantsContext);
  if (!context) {
    throw new Error('useParticipants must be used within a ParticipantsProvider');
  }
  return context;
};

export const ParticipantsProvider = ({ children }: { children: ReactNode }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const addParticipant = (participant: Participant) => {
    setParticipants(prevParticipants => [...prevParticipants, participant]);
  };

  const removeParticipant = (uid: string) => {
    setParticipants(prevParticipants => prevParticipants.filter(p => p.uid !== uid));
  };

  return (
    <ParticipantsContext.Provider value={{ participants, addParticipant, removeParticipant }}>
      {children}
    </ParticipantsContext.Provider>
  );
};
