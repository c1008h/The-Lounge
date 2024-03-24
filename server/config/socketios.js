const { Server } = require('socket.io');
const { createChatSession, deleteSessionFromRT, chatSessionExists } = require('../services/realtimeDatabase/chatSession');
const { addChatSessionToUser, deleteSessionFromUser, userHasChatSession } = require('../services/firestore/user')
const { addParticipant } = require('../services/realtimeDatabase/participants')
const { saveMessage } = require('../services/realtimeDatabase/message')
const { searchFriend, addFriend, acceptRequest, declineRequest, deleteFriend, cancelRequest } = require('../services/firestore/friend')
// const { createSessionAnon, addToAnonSession, saveAnonMessage, removeAnonFromSession, deleteSession } = require('../services/realtimeDatabase/anonSession')
const { createUniqueId } = require('../utils/tempIdGenerator')

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    let sockets = []

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('createAnonSession', async () => {
            console.log("SOCKET ROOM:", socket.rooms);
            console.log("SOCKET ID ON CREATING:", socket.id);

            const sessionId = createUniqueId()
            // const sessionId = await createSessionAnon()
            console.log('session created in server:', sessionId)

            socket.join(sessionId);

            const count = io.of(sessionId).sockets.size;
            console.log(`Client ${socket.id} joined room ${sessionId}. Total clients: ${sockets.size}`);

            socket.emit('anonSessionCreated', sessionId)
            io.in(sessionId).emit('roomOccupancyUpdate', { sessionId, occupancy: count });

        })

        socket.on('addAnonToSession', async (user, sessionId) => {
            
            console.log("SOCKET ROOM in addAnonToSession:", socket.rooms);
            console.log("SOCKET ID ON ADDING TO SESSION:", socket.id);

            // const userId = await addToAnonSession(user, sessionId)
            const userId = createUniqueId()

            console.log(`User ${user} added to session ${sessionId} with user ID: ${userId}`);

            socket.join(sessionId);

            io.in(sessionId).emit('anonAddedToSession',  userId, user );

            socket.emit('anonAddedToSession', userId, user );
        })

        socket.on('disconnectAnon', async (userId, sessionId, participant) => {
            console.log('user id:', userId)
            console.log('session id:', sessionId)
            console.log('participant count:', participant)
            console.log(`Removed user ${userId} from session ${sessionId}`);

            // if (participant === 1) {
            //     await deleteSession(sessionId)
            //     console.log(`Session ${sessionId} deleted due to no participants.`);
            // }

            // await removeAnonFromSession(userId, sessionId);

            socket.leave(sessionId);
            io.in(sessionId).emit('userLeft', userId);
        })

        socket.on('sendAnonMessage', async (sessionId, message) => {
            console.log("SOCKET ROOM in sendAnonMessage:", socket.rooms);
            console.log("SOCKET ID ON SENDING MESSAGE:", socket.id);

            // await saveAnonMessage(sessionId, message)
            // io.to(sessionId).emit('newAnonMessage', message);
            console.log('Message received:', message)
            console.log(`At sessionId : ${sessionId}`)
            // socket.to(sessionId).emit('receiveAnonMessage', message);
            io.to(sessionId).emit('receiveAnonMessage',  message );

        })

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

        socket.on('deleteFriend', async (userId, friend) => {
            const result = await deleteFriend(userId, friend)
            console.log("successfully deleted:", result)
            socket.emit('friendDeleted', result)
        })

        socket.on('acceptFriendRequest', async (userId, friendId) => {
            const result = await acceptRequest(userId, friendId)
            socket.emit('acceptedFriendRequest', result)
        })

        socket.on('declineFriendRequest', async (userId, friend) => {
            const result = await declineRequest(userId, friend)
            socket.emit('friendRemoved', result)
        })

        socket.on('cancelFriendRequest', async (userId, friend) => {
            const result = await cancelRequest(userId, friend)
            console.log("successfully deleted:", result)
            socket.emit('canceledFriendRequest', result)
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
