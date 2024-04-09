import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socketManager } from '@/utils/socketManager';

export const useSocket = (token: string): { socket: Socket | null, connect: () => void } => {
  const [socket, setSocket] = useState<Socket | null>(socketManager.getSocket());

  useEffect(() => {
    socketManager.connect(token);
    let currentSocket = socketManager.getSocket();
    setSocket(currentSocket)

    const handleConnect = () => setSocket(socketManager.getSocket());
    const handleDisconnect = () => setSocket(null);


    currentSocket?.on('connect', handleConnect);
    currentSocket?.on('disconnect', handleDisconnect);

    return () => {
      if (currentSocket) {
        currentSocket.off('connect', handleConnect);
        currentSocket.off('disconnect', handleDisconnect);
      }
    };
  }, [token]);

  const connect = () => {
    socketManager.connect(token);
  };

  const disconnect = () => {
    socketManager.disconnect(); // This method should exist in your socketManager
    setSocket(null);
  };

  return { socket, connect };
};