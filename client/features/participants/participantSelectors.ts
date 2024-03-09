import { Participant } from "@/interfaces/Participant"; 
import { RootState } from "../store";

export const selectParticipants = (state: RootState): Participant[] => state.participants.participants;
