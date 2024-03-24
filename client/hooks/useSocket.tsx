import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;
let refCount = 0;

if (typeof process.env.NEXT_PUBLIC_DEPLOY === 'undefined') throw new Error('NEXT_PUBLIC_DEPLOY is not defined');
const PORT =  process.env.NEXT_PUBLIC_SOCKET_PORT|| process.env.NEXT_PUBLIC_DEPLOY 

// || process.env.NEXT_PUBLIC_SOCKET_PORT 

export const useSocket = (): { socket: Socket | null } => {
  const [socket, setSocket] = useState<Socket | null>(socketInstance);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(PORT);
      setSocket(socketInstance);
      console.log('Creating new socket connection:', PORT);
    }

    refCount++; // Increment reference count when a component mounts
    setSocket(socketInstance);

    return () => {
      refCount--; // Decrement reference count when a component unmounts
      if (refCount === 0) { // If no components are using the socket, disconnect
        console.log('Disconnecting socket:', PORT);
        socketInstance?.disconnect();
        socketInstance = null; // Reset the socket instance to null
      }
    };
  }, []);

  return { socket };
};