import { useCallback, useState, useEffect } from 'react';
import { useSocket } from '../useSocket'; 
import { useDispatch } from 'react-redux';
import { Participant } from '@/interfaces/Participant';

interface ParticipantProps {
    participants: Participant[];
    addParticipant: (sessionId: string, participant: Participant) => void;
    removeParticipant: () => void;
    removeSpecificParticipant: (uid: string) => void;
}

export const useParticipants = (): ParticipantProps => {
    const { socket } = useSocket();
    const [participants, setParticipants] = useState<Participant[]>([]);

    const dispatch = useDispatch(); 

    const addParticipant = useCallback((sessionId: string, participant: Participant) => {
        // console.log("PARTICIPANT IN CONTEXT:", participant)

        console.log(`Participant ${participant} and current session ${sessionId} inside of participant context`)
        // console.log("CURRENT SESSION ID IN CONTEXT:", sessionId)
        if (!sessionId || !participant) return

        setParticipants(prevParticipants => {
            const isAlreadyAdded = participants.some((p) => p.uid === participant.uid);
            if (!isAlreadyAdded) {
                return [...prevParticipants, participant];
            }
            return prevParticipants;
        })
        
        if (socket) socket.emit('addParticipant', sessionId, participant);

    }, [socket, participants]);

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

    // const validateParticipant = (participant) => {
    //     // Implement validation logic, e.g., check if the participant exists in the database
    //     // This function can be async if it needs to fetch data
    //     return true; // Placeholder
    // };

    useEffect(() => {
        if (!socket) return

        const handleAddParticipant = (sessionId: string, participant: Participant) => addParticipant(sessionId, participant);
        const handleRemoveParticipant = (uid: string) => removeSpecificParticipant(uid);

        socket.on('participantAdded', handleAddParticipant);
        socket.on('participantRemoved', handleRemoveParticipant);

        return () => {
            socket.off('participantAdded', handleAddParticipant);
            socket.off('participantRemoved', handleRemoveParticipant);
        }

    }, [socket])

    return { participants, addParticipant, removeParticipant, removeSpecificParticipant };
};
