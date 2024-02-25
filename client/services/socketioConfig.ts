import { Socket, io } from "socket.io-client"

export default function socketClient() {
    const socket = io(`:${PORT + 1}`, { path: '/', addTrailingSlash: false })

    socket.on("connect", () => {
        console.log("connected")
    })

    socket.on("disconnect", () => {
        console.log("Disconnected")
    })

    socket.on("connect_error", async err => {
        console.log(`connect_error due to ${err.message}`)
        await fetch("/api/socket")
    })

    return socket
};

