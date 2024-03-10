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

        socket.on('addSession', async (data) => {
            console.log("DATA", data)

            const chatSessionId = await createChatSession(data)

            socket.emit('sessionAdded', chatSessionId)

        })
        
        socket.on('startchat', async (data) => {
            const participants = data.participants
            const initiator = data.initiator;   
            const chatSessionId = await createChatSession(participants)

            console.log("chatsessionID", chatSessionId)
            await Promise.all([
                addChatSessionToUser(initiator, chatSessionId), 
                ...participants.map(userId => addChatSessionToUser(userId, chatSessionId)) 
            ]);
            console.log(`new session created successfully with session id: ${chatSessionId}`)

            socket.join(chatSessionId);
            socket.emit('chatSessionId', { chatSessionId });

            socket.emit('chatStarted', { initiator, chatSessionId });
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

            const { sender, message, timestamp, sessionId } = data

            const messages = {
                sender: sender,
                message: message,
                timestamp: timestamp
            }
            
            try {
                console.log("RECEIVED MESSAGE:", data)
                await saveMessage(sessionId, { messages });
                io.to(sessionId).emit('newMessage', messages)
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
