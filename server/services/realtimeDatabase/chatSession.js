const { db, realTimeDb  } = require('../../config/firebaseConfig')

const createChatSession = async (participants) => {
    try {
        const chatSessionRef = realTimeDb.ref('sessions')
        const newChatSessionRef = chatSessionRef.push()

        await newChatSessionRef.set({
            participants: participants,
            createdAt: Date.now(),
            messages: []
        })

        const chatSessionId = newChatSessionRef.key;
        console.log('New chat session created with ID:', chatSessionId);
        return chatSessionId;
    } catch (error) {
        console.error('Error creating chat session:', error);
        throw error;
    }
}
const saveMessage = async (chatSessionId, messageData) => {
    try {
        const sessionMessagesRef = realTimeDb.ref(`sessions/${chatSessionId}/messages`);      
        await sessionMessagesRef.push(messageData); 

        console.log('Message saved to Firebase chat session');
    } catch (error) {
        console.error('Error saving message to Firebase:', error);
        throw error; 
    }
};

const chatSessionExists = async (chatSessionId) => {
    const sessionRef = realTimeDb.ref(`sessions/${chatSessionId}`);
    const snapshot = await sessionRef.once('value');
    return snapshot.exists();
};

module.exports = {
    saveMessage, 
    createChatSession,
    chatSessionExists
};