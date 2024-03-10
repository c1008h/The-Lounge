import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/authSlices'
import participantReducer from './participants/participantSlices'
import sessionReducer from './session/sessionSlices'

const store = configureStore({
    reducer: {
        auth: authReducer,
        participant: participantReducer,
        session: sessionReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export default store;