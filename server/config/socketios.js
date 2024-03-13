const { Server } = require('socket.io');
const { createChatSession, deleteSessionFromRT, chatSessionExists } = require('../services/realtimeDatabase/chatSession');
const { addChatSessionToUser, deleteSessionFromUser, userHasChatSession } = require('../services/firestore/user')
const { addParticipant } = require('../services/realtimeDatabase/participants')
const { saveMessage } = require('../services/realtimeDatabase/message')
const { searchFriend, addFriend, acceptRequest, declineRequest } = require('../services/firestore/friend')

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
            const chatSessionId = await createChatSession(data)
            await addChatSessionToUser(data, chatSessionId)

            socket.emit('sessionAdded', chatSessionId)
        })

        socket.on('deleteSession', async (sessionId, userId) => {
            console.log("Session ID", sessionId)
            console.log("user id:", userId)
            await deleteSessionFromUser(sessionId, userId)
            await deleteSessionFromRT(sessionId)

            socket.emit('sessionDeleted', 'session deleted!')
        })

        socket.on('addParticipant', async (sessionId, participant) => {
            if (!participant || !sessionId) return

            console.log("Session ID:", sessionId)
            console.log("Participant:", participant)

            await addParticipant(sessionId, participant)

            socket.emit('participantAdded', participant)
        })

        socket.on('sendMessage', async (sessionId, message) => {
            if (!sessionId || !message) return

            console.log("Session ID", sessionId)
            console.log("Message:", message)
            
            await saveMessage(sessionId, message)

            socket.emit('sentMessage', "message saved!")
        })

        socket.on('searchFriend', async (friendId) => {
            console.log( friendId )
            const friendFound = await searchFriend(friendId)

            socket.emit('friendFound', friendFound)
        })

        socket.on('addFriend', async (userId, friend) => {
            console.log(friend)
            console.log('userId:', userId)

            const result = await addFriend(userId, friend)
            console.log("successfully added:", result)
            socket.emit('friendAdded', result)
        })

        socket.on('acceptFriendRequest', async (userId, friend) => {
            const result = await acceptRequest(userId, friend)
            socket.emit('acceptedFriendRequest', result)
        })

        socket.on('declineFriendRequest', async (userId, friend) => {
            const result = await declineRequest(userId, friend)
            socket.emit('declinedFriendRequest', result)
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
    
        // socket.on('sendMessage', async (data) => {

        //     const { sender, message, timestamp, sessionId } = data

        //     const messages = {
        //         sender: sender,
        //         message: message,
        //         timestamp: timestamp
        //     }
            
        //     try {
        //         console.log("RECEIVED MESSAGE:", data)
        //         await saveMessage(sessionId, { messages });
        //         io.to(sessionId).emit('newMessage', messages)
        //     } catch(error) {
        //         console.error("Error handling chat message:", error)
        //     }
        // });

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
