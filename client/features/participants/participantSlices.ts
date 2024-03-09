import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Participant } from "@/interfaces/Participant";

interface ParticipantState {
    participants: Participant[];
}

const initialState: ParticipantState = {
    participants: []
}

export const participantSlice = createSlice({
    name: "participant",
    initialState,
    reducers: {
        addParticipant: (state, action: PayloadAction<Participant>) => {
            state.participants.push(action.payload);
        },
        removeParticipant: (state, action: PayloadAction<string>) => {
            state.participants = state.participants.filter(participant => participant.id !== action.payload);
        }
    },
})

export const { addParticipant, removeParticipant } = participantSlice.actions;

export default participantSlice.reducer;
