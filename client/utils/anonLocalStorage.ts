import { TempUserProps } from '@/interfaces/TempUser'

export const storeUserSessionData = (sessionId: string, userSessionData: TempUserProps): void => {
    localStorage.setItem(sessionId, JSON.stringify(userSessionData));
};
  
export const retrieveUserSessionData = (sessionId: string): TempUserProps | null => {
    const data = localStorage.getItem(sessionId);
    return data ? JSON.parse(data) : null;
};
  
export const clearUserSessionData = (sessionId: string): void => {
    localStorage.removeItem(sessionId);
};