import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "@/interfaces/Session";

interface SessionState {
    currentSession: string;
    sessions: Session[];
}

const initialState: SessionState = {
    currentSession: "",
    sessions: []
}

export const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        selectSessionToState: (state, action: PayloadAction<string>) => {
            state.currentSession = action.payload;
        },
        addSessionToState: (state, action: PayloadAction<Session>) => {
            state.sessions.push(action.payload);
        },
        deleteSessionFromState: (state, action: PayloadAction<string>) => {
            state.sessions = state.sessions.filter(session => session.id !== action.payload);
        },
        leaveSessionFromState: (state, action: PayloadAction<string>) => {
            state.sessions = state.sessions.filter(session => session.id !== action.payload);
        }
    },
})

export const { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState } = sessionSlice.actions;

export default sessionSlice.reducer;
