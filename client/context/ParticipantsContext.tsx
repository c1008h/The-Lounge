import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Participant } from '@/interfaces/Participant';
import { useSocket } from '@/hooks/useSocket';
interface ParticipantsContextType {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  removeParticipant: () => void;
  removeSpecificParticipant: (uid: string) => void;
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
    const { socket } = useSocket();
    const [participants, setParticipants] = useState<Participant[]>([]);

    const addParticipant = useCallback((participant: Participant) => {
        setParticipants(prevParticipants => {
            const isAlreadyAdded = participants.some((p) => p.uid === participant.uid);
            if (!isAlreadyAdded) {
                return [...prevParticipants, participant];
            }
            return prevParticipants;
        })
        
        if (socket) socket.emit('addParticipant', participant);

    }, [participants, socket]);

    const removeSpecificParticipant = useCallback((uid: string) => {
        setParticipants(participants.filter((p) => p.uid !== uid));

        if (socket) socket.emit('removeParticipant', uid);

    }, [participants, socket])

    const removeParticipant = useCallback(() => {
        if (participants.length > 0) {
            const removedParticipantId = participants[participants.length - 1].uid;
            setParticipants(prevParticipants => prevParticipants.slice(0, -1));

            if (socket) socket.emit('removeParticipant', removedParticipantId);
        }
    }, [socket, participants]);

    const validateParticipant = (participant) => {
        // Implement validation logic, e.g., check if the participant exists in the database
        // This function can be async if it needs to fetch data
        return true; // Placeholder
    };

    useEffect(() => {
        if (!socket) return;

        const handleAddParticipant = (participant: Participant) => addParticipant(participant);
        const handleRemoveParticipant = (uid: string) => removeSpecificParticipant(uid);

        socket.on('participantAdded', handleAddParticipant);
        socket.on('participantRemoved', handleRemoveParticipant);

        return () => {
            socket.off('participantAdded', handleAddParticipant);
            socket.off('participantRemoved', handleRemoveParticipant);
        }
    }, [socket, addParticipant, removeParticipant, removeSpecificParticipant])

    return (
        <ParticipantsContext.Provider value={{ participants, addParticipant, removeParticipant, removeSpecificParticipant }}>
            {children}
        </ParticipantsContext.Provider>
    );
};
