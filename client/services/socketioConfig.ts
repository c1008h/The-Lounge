import { io } from "socket.io-client"

export default function socketClient() {
    const deployUrl = process.env.NEXT_PUBLIC_DEPLOY

    if (!deployUrl) throw new Error('NEXT_PUBLIC_DEPLOY is not defined');

    const defaultOptions = {
        reconnectionAttempts: 5, 
        reconnectionDelay: 3000, 
        transports: ['websocket', 'polling'], // Fallback to polling if WebSocket is not available
    };

    const socket = io(deployUrl, defaultOptions);

    socket.on("connect", () => {
        console.log("connected to socket server");
    })

    socket.on("disconnect", () => {
        console.log("Disconnected from socket server")
    })

    socket.on("connect_error", async err => {
        console.log(`connect_error due to ${err}`)
    })

    return socket
};

