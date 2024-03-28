import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socketManager } from '@/utils/socketManager';

export const useSocket = (token: string): { socket: Socket | null, connect: () => void } => {
  const [socket, setSocket] = useState<Socket | null>(socketManager.getSocket());

  useEffect(() => {
    const handleConnect = () => setSocket(socketManager.getSocket());
    const handleDisconnect = () => setSocket(null);

    // Assuming the socket instance could be null, check before attaching event listeners
    socketManager.getSocket()?.on('connect', handleConnect);
    socketManager.getSocket()?.on('disconnect', handleDisconnect);

    return () => {
      const currentSocket = socketManager.getSocket();
      if (currentSocket) {
        currentSocket.off('connect', handleConnect);
        currentSocket.off('disconnect', handleDisconnect);
      }
    };
  }, []);

  const connect = () => {
    socketManager.connect(token);
  };

  return { socket, connect };
};