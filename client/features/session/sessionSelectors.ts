import { Session } from "@/interfaces/Session"; 
import { RootState } from "../store";

export const selectSession = (state: RootState): string => state.session.currentSession;
export const sessions = (state: RootState): Session[] => state.session.sessions
export const addingToChat = (state: RootState): boolean => state.session.addToChat