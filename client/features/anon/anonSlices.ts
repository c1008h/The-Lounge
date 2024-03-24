import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
    displayName: string | null;
    uid: string | null;
    anonSessionId: string | null;
    accessToken: string | null;
}

const initialState: SessionState = {
    displayName: null,
    uid: null,
    anonSessionId: null,
    accessToken: null,
}

export const anonSlice = createSlice({
    name: "anon",
    initialState,
    reducers: {
        setDisplayName: (state, action: PayloadAction<string>) => {
            state.displayName = action.payload;

        },
        setUid: (state, action: PayloadAction<string>) => {
            state.uid = action.payload;
        },
        storeSessionId: (state, action: PayloadAction<string>) => {
            state.anonSessionId = action.payload;
        },
        storeToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        clearSessionId: (state) => {
            state.anonSessionId = null;
            state.uid = null;
            state.displayName = null;
            state.accessToken = null;
        }
    },
})

export const { 
    setDisplayName, 
    setUid, 
    storeSessionId, 
    storeToken,
    clearSessionId
} = anonSlice.actions;

export default anonSlice.reducer;
