const { Server } = require('socket.io');
const { createChatSession, chatSessionExists, saveMessage } = require('../services/realtimeDatabase/chatSession');
const { addChatSessionToUser, userHasChatSession } = require('../services/firestore/user')

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
    console.log("Socket.IO server initialized");

    io.on('connection', (socket) => {
        console.log('a user connected');
        
        // Handler for starting a new chat session
        socket.on('startchat', async (participants) => {
            const chatSessionId = await createChatSession(participants)
            await Promise.all(participants.map(userId => addChatSessionToUser(userId, chatSessionId)))

            socket.join(chatSessionId);
            socket.emit('chatStarted', { chatSessionId });
        })

        socket.on('joinRoom', async ({ userId, roomId }) => {
            try {
                socket.join(roomId)
                const chatSessionExist = await chatSessionExists(roomId);
                const userAuthorized = await userHasChatSession(userId, roomId);
    
                if (chatSessionExist && userAuthorized) {
                    socket.join(roomId);                
                    socket.emit('joinedChat', { roomId });
                    
                    // Optionally, load and emit previous messages from this chat session
                    // const messages = await loadMessagesForSession(roomId);
                    socket.emit('previousMessages', messages);
                } else {
                    socket.emit('errorJoiningChat', { message: 'Unable to join chat.' });
                }
            } catch (error) {
                console.error('Error joining chat session:', error);
                socket.emit('errorJoiningChat', { message: error.message || 'Unable to join chat.' });
            }
        })
    
        socket.on('sendMessage', async (data) => {
            try {
                console.log("RECEIVED MESSAGE:", data)
                await saveMessage(roomId, { data });
                io.to(roomId).emit('newMessage', data)
            } catch(error) {
                console.error("Error handling chat message:", error)
            }
        });

        socket.on('leaveRoom', ({ userId, roomId }) => {
            socket.leave(roomId)
            console.log(`User ${userId} left room ${roomId}`);
        })

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    });
    
    io.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
    });
}

module.exports = setupSocket;
