import React, { useState, useEffect } from 'react';
import { sessionsRT } from '@/services/firebaseConfig';
import { child, onValue, Unsubscribe, DatabaseReference} from 'firebase/database';
import { Participant } from '@/interfaces/Participant';

interface ParticipantsListenerResult {
  participants: Participant[] | null;
  error: string | null;
}

export const useParticipantsListener = (sessionId: string): ParticipantsListenerResult => {
  const [participants, setParticipants] = useState<Participant[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const participantsRef: DatabaseReference = child(sessionsRT, `${sessionId}/participants`)

    const handleData = (snapshot: any) => {
      if (snapshot.exists()) {
        const participantsData: Record<string, Participant> = snapshot.val()
        const participantsArray = Object.values(participantsData)
        setParticipants(participantsArray);
        setError(null);
      } else {
        setParticipants(null);
        setError('No participants found.');
      }
    }

    const unsubscribe: Unsubscribe = onValue(participantsRef, handleData);

    return () => {
      unsubscribe()
    }
  }, [sessionId])

  return { participants, error }
};
  