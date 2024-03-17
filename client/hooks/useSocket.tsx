import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

if (typeof process.env.NEXT_PUBLIC_DEPLOY === 'undefined' || typeof process.env.NEXT_PUBLIC_SOCKET_PORT === 'undefined') throw new Error('NEXT_PUBLIC_SOCKET_PORT is not defined');
const PORT = process.env.NEXT_PUBLIC_DEPLOY || process.env.NEXT_PUBLIC_SOCKET_PORT 

export const useSocket = (): { socket: Socket | null } => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(PORT);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket };
};