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
        addAParticipant: (state, action: PayloadAction<Participant>) => {
            state.participants.push(action.payload);
        },
        backspaceParticipant: (state) => {
            state.participants = state.participants.slice(0, -1)
        },
        removeParticipant: (state, action: PayloadAction<string>) => {
            state.participants = state.participants.filter(participant => participant.uid !== action.payload);
        }
    },
})

export const { addAParticipant, backspaceParticipant, removeParticipant } = participantSlice.actions;

export default participantSlice.reducer;
