import { createSlice } from "@reduxjs/toolkit";

interface UserProps {
    uid: string;
    accessToken: string;
}

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null,
    },
    reducers: {
        loginUser: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload
        },
        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        }
    },
})

export const { loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
