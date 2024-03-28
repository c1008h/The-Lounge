import io, { Socket } from 'socket.io-client';

class SocketManager {
    socket: Socket | null = null;

    private defaultOptions = {
        reconnectionAttempts: 5, 
        reconnectionDelay: 3000, 
        transports: ['websocket', 'polling'], // Fallback to polling if WebSocket is not available
    };

    connect(token: string) {
        if (!this.socket) {
            console.log('Creating new socket connection');
            this.socket = io(process.env.NEXT_PUBLIC_DEPLOY as string, this.defaultOptions);
            this.socket.on('connect', () => {
                console.log(`Socket connected: ${this.socket?.id}`);
            });
        }
    }

    disconnect() {
        if (this.socket) {
            console.log('Disconnecting socket');
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }
}

export const socketManager = new SocketManager();