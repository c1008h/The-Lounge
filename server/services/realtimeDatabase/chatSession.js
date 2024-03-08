const { db, chatSessionsRef  } = require('../../config/firebaseConfig')

const createChatSession = async (participants) => {
    try {
        const chatSessionRef = chatSessionsRef.push();
        const chatSessionId = chatSessionRef.key;
        const chatSessionReference = chatSessionsRef.child(chatSessionId);
        const participantsRef = chatSessionReference.child('participants');
        const createdRef = chatSessionReference.child('created');
        const messagesRef = chatSessionReference.child('messages');
        const timestamp = Date.now();

        await participantsRef.set({ [uid1]: true, [uid2]: true });
        await createdRef.set(formattedDate)
        await messagesRef.set([]);


        console.log('New chat session created with ID:', chatSessionId);

        return chatSessionId;
    } catch (error) {
        console.error('Error creating chat session:', error);
        throw error;
    }
}
const saveMessage = async (sessionId, data) => {
    // console.log('message data', data.message)
    if (!sessionId) return

    try {
        const sessionMessagesRef = realTimeDb.ref(`sessions/${sessionId}/messages`);      
        await sessionMessagesRef.push(data.message); 

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