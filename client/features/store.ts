import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/authSlices'
import participantReducer from './participants/participantSlices'

const store = configureStore({
    reducer: {
        auth: authReducer,
        participant: participantReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export default store;