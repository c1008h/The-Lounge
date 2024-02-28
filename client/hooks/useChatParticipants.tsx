import { useState } from 'react'

export interface ParticipantsProps {
    uid: string;
    name: string;
    role: string;
}

export const useChatParticipants = () => {
    const [participants, setParticipants] = useState<ParticipantsProps[]>([]);
  
    const addParticipant = (participant: ParticipantsProps) => {
      // Assuming `participant` is an object with at least a `name` property
      // Check if the participant is already added based on a unique property, e.g., an ID
      const isAlreadyAdded = participants.some((p) => p.uid === participant.uid);
      if (!isAlreadyAdded) {
        setParticipants([...participants, participant]);
      }
    };

    const removeSpecificParticipant = (uid: string) => {
      setParticipants(participants.filter((p) => p.uid !== uid));

    }
  
    const removeParticipant = () => {
      setParticipants(prevParticipants => prevParticipants.slice(0, -1));
    };
  
    // Optionally, a function to validate participants before adding
    const validateParticipant = (participantName) => {
      // Implement validation logic, e.g., check if the participant exists in the database
      // This function can be async if it needs to fetch data
      return true; // Placeholder
    };
  
    return { 
      participants, 
      removeSpecificParticipant, 
      addParticipant, 
      removeParticipant, 
      validateParticipant 
    };
};
  