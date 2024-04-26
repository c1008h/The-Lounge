"use client"
import React, { useEffect, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { socketManager } from '@/utils/socketManager';
import { useAuth } from '@/context/AuthContext';
import SocketContext from '@/context/SocketContext';

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(socketManager.getSocket());
    const { token } = useAuth();

    // useEffect(() => {
    //     if (token) {
    //         connect();
    //     }

    //     return () => {
    //         // disconnect();
    //     };
    // }, [token, connect]);


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
      socketManager.disconnect(); 
      setSocket(null);
    };
  
    // return { socket, connect };

  return (
    <SocketContext.Provider value={{ socket }}>
        {children}
    </SocketContext.Provider>
  );
};
