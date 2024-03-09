import { RootState } from "../store";

export const selectIsAuthenticated = (state: RootState):boolean => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;