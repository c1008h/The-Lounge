import { useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { socketManager } from '@/utils/socketManager';

// let socketInstance: Socket | null = null;
let refCount = 0;

// if (typeof process.env.NEXT_PUBLIC_DEPLOY === 'undefined') throw new Error('NEXT_PUBLIC_DEPLOY is not defined');
// const PORT =  process.env.NEXT_PUBLIC_SOCKET_PORT|| process.env.NEXT_PUBLIC_DEPLOY 

// || process.env.NEXT_PUBLIC_SOCKET_PORT 

export const useSocket = (): { socket: Socket | null, connect: () => void } => {
  const [socket, setSocket] = useState<Socket | null>(socketManager.getSocket());

  // const connectSocket = useCallback(() => {
  //   if (!socketInstance) {
  //     console.log('Creating new socket connection:', PORT);
  //     socketInstance = io(PORT);
      
  //     refCount++; // Increment reference count when a component mounts

  //     setSocket(socketInstance);
  //   }
  // }, []);

  // useEffect(() => {
    // if (!socketInstance) {
    //   socketInstance = io(PORT);
    //   setSocket(socketInstance);
    //   console.log('Creating new socket connection:', PORT);
    // }

    // refCount++; // Increment reference count when a component mounts
    // setSocket(socketInstance);

    // return () => {
    //   refCount--; // Decrement reference count when a component unmounts
    //   if (refCount === 0) { // If no components are using the socket, disconnect
    //     console.log('Disconnecting socket:', PORT);
    //     socketInstance?.disconnect();
    //     socketInstance = null; // Reset the socket instance to null
    //   }
  //   // };
  //   if (socketInstance) {
  //     console.log('Disconnecting socket:', PORT);
  //     socketInstance.disconnect();
  //     socketInstance = null;
  //   }
  // }, []);
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
    socketManager.connect();
  };

  return { socket, connect };
};