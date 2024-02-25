const { Server } = require('socket.io');

function setupSocket(server) {
    const io = new Server(server)

    io.on('connection', (socket) => {
        console.log('a user connected');
    
        socket.on("joinExistingSession", async (chatSessionId) => {
            try {
                if (!chatSessionId) {
                    console.error("No chat session ID provided for joining existing chat.")
                    return
                }

                const messages = await loadMessages(chatSessionId);
                socket.emit('loadMessages', messages);
            } catch (error) {
                console.error("Error loading messages:", error)
            }
        })

        socket.on('createNewSession', async ({ uid1, uid2 }) => {
            try {
                const chatSessionId = await createChatSession(uid1, uid2);
                socket.emit('chatSessionCreated', chatSessionId);
            } catch (error) {
                console.error("Error creating chat session:", error);
                socket.emit('chatSessionCreationFailed');
            }
        });
    
        socket.on('chat message', async (data) => {
            try {
                const chatSessionId = data.chatSessionId; 
    
                await saveMessageToDatabase(chatSessionId, {
                    senderUid: data.senderUid,
                    message: data.message,
                    timestamp: Date.now(),
                });
                // console.log('Message:', data);
                io.emit('chat message', data);
    
            } catch(error) {
                console.error("Error handling chat message:", error)
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    });
    
    io.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
    });
}

module.exports = setupSocket;
