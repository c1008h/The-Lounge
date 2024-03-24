import { RootState } from "../store";

export const storedSessionId = (state: RootState) => state.anon.anonSessionId;
export const storedDisplayName = (state: RootState) => state.anon.displayName;
export const storedTempUid = (state: RootState) => state.anon.uid;
export const storedToken = (state: RootState) => state.anon.accessToken;
export const participantCount = (state: RootState) => state.anon.participantsActive;