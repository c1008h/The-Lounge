import { io } from "socket.io-client"

export default function socketClient() {
    if (typeof process.env.NEXT_PUBLIC_DEPLOY === 'undefined') throw new Error('NEXT_PUBLIC_SOCKET_PORT is not defined');
    const socket = io(process.env.NEXT_PUBLIC_DEPLOY)

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

