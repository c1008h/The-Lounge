import React, { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => useContext(SocketContext);

export default SocketContext;
