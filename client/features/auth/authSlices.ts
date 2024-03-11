import { createSlice } from "@reduxjs/toolkit";

interface UserProps {
    uid: string;
    accessToken: string;
    expirationTime: number;
    refreshToken: string;
    displayName?: string;
    email?: string;
}

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null as UserProps | null,
    },
    reducers: {
        loginUser: (state, action) => {
            const { uid, accessToken, stsTokenManager, displayName, email } = action.payload;

            state.isAuthenticated = true;
            state.user = {
                uid,
                accessToken,
                expirationTime: stsTokenManager.expirationTime,
                refreshToken: stsTokenManager.refreshToken,
                displayName: displayName || null,
                email: email || null,
            }
        },
        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        }
    },
})

export const { loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
