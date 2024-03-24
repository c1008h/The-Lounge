import { TempUserProps } from '@/interfaces/TempUser'
import { user } from '@nextui-org/theme';

export function setUserSession(tempSessionId: string, sessionId: string, userId: string, displayName: string) {
    // console.log("userId:", userId)
    // console.log("sessionId:", sessionId)
    // console.log("displayName:", displayName)
    console.log("SETTING tempSessionId:", tempSessionId)

    const sessionData = { sessionId, userId, displayName };
    sessionStorage.setItem(tempSessionId, JSON.stringify(sessionData));
}
  
export function getUserSession(sessionToken: string) {
    const sessionData = sessionStorage.getItem(sessionToken);
    return sessionData ? JSON.parse(sessionData) : null;
}
  
export function clearUserSession(sessionToken: string) {
    sessionStorage.removeItem(sessionToken);
}