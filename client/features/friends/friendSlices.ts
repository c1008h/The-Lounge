import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Friend } from "@/interfaces/Friend";

interface FriendState {
    friends: Friend[];
}

const initialState: FriendState = {
    friends: []
}

export const friendSlice = createSlice({
    name: "friend",
    initialState,
    reducers: {
        addFriend: (state, action: PayloadAction<Friend>) => {
            state.friends.push(action.payload);
        },
        removeFriend: (state, action: PayloadAction<string>) => {
            state.friends = state.friends.filter(friend => friend.uid !== action.payload);
        },
        clearFriends: (state) => {
            state.friends = []
        },
        initializeFriendList: (state, action: PayloadAction<Friend[]>) => {
            state.friends = action.payload;
        }
    },
})

export const { 
    addFriend, 
    removeFriend, 
    clearFriends, 
    initializeFriendList,
} = friendSlice.actions;

export default friendSlice.reducer;
