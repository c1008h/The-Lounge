import React, { createContext, useContext } from 'react';
import { Friend } from '@/interfaces/Friend'
// import { useDispatch } from 'react-redux';
// import { selectSessionToState, addSessionToState, deleteSessionFromState, leaveSessionFromState} from '@/features/session/sessionSlices'
// import { Session } from '@/interfaces/Session';
// import { useSocket } from '@/hooks/useSocket';
// import { TempUserProps, defaultTempUser } from '@/interfaces/TempUser'


interface SessionContextType {
    currentSession: string | null;
    participants: Friend[]; 
    setCurrentSession: (sessionId: string | null) => void;
    setParticipants: (participants: Friend) => void; 
    addParticipant: (newParticipant: Friend) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

export default SessionContext;



// interface SessionContextType {
//     sessions: Session[];
//     addASession: (uid: string) => void;
//     deleteSession: (sessionId: string, userId: string) => void;
//     leaveSession: (sessionId: string) => void;
//     selectSession: (sessionId: string) => void;
//     currentSessionId: string;

//     // addUserToAnon: (user: string, sessionId: string) => Promise<TempUserProps>;
//     // addUserToAnon: (user: string, sessionId: string) => TempUserProps;
// }

// const SessionContext = createContext<SessionContextType | undefined>(undefined);

// export const useSession = (): SessionContextType => {
//     const context = useContext(SessionContext);
//     if (!context) {
//         throw new Error('useSession must be used within a SessionProvider');
//     }
//     return context;
// }

// export const SessionProvider = ({ children }: { children: ReactNode }) => {
//     const { socket } = useSocket('user token')
//     const [sessions, setSessions] = useState<Session[]>([]);
//     const [currentSessionId, setCurrentSessionId] = useState<string>('')
//     const dispatch = useDispatch(); 


//     const addASession = useCallback((uid: string) => {
//         if (socket) socket.emit('addSession', uid);
//     }, [socket])

//     const deleteSession = useCallback((sessionId: string, userId: string) => {
//         setSessions(sessions.filter((s) => s.id !== sessionId));

//         if (socket) socket.emit('deleteSession', sessionId, userId);
//     }, [socket, sessions])

//     const leaveSession = useCallback((sessionId: string) => {
//         setSessions(sessions.filter((s) => s.id !== sessionId));
//         if (socket) socket.emit('leaveSession', sessionId);
//     }, [socket, sessions])

//     const selectSession = useCallback((sessionId: string) => {
//         console.log('current sessnion in context:', sessionId)
//         setCurrentSessionId(sessionId)
//         dispatch(selectSessionToState(sessionId))
//     }, [dispatch])

//     useEffect(() => {
//         if (!socket) return
//         // const handleAddSession = (uid: string) => addASession(uid);
//         const handleSessionAdded = (sessionId: string) => {
//             console.log('SESSION ID RETURNED FROM SERVER:', sessionId)
//             setCurrentSessionId(sessionId)
//             dispatch(selectSessionToState(sessionId))
//             setSessions(prevSessions => [
//                 ...prevSessions,
//                 { id: sessionId, participants: [], createdAt: new Date() }
//             ]);
//         }
//         const handleRemoveSession = (sessionId: string, userId: string) => deleteSession(sessionId, userId);

//         socket.on('sessionAdded', handleSessionAdded);
//         socket.on('sessionRemoved', handleRemoveSession);
//         socket.on('leaveSession', handleRemoveSession)


//         return () => {
//             socket.off('sessionAdded', handleSessionAdded);
//             socket.off('sessionRemoved', handleRemoveSession);
//             socket.off('sessionLeft', handleRemoveSession)
//         }
//     }, [socket, dispatch, deleteSession, leaveSession])
  
//     return (
//         <SessionContext.Provider value={{ sessions,  addASession, deleteSession, leaveSession, currentSessionId, selectSession }}>
//             {children}
//         </SessionContext.Provider>
//     );
// };