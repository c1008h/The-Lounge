const { db, chatSessionsRef  } = require('../../config/firebaseConfig')

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

module.exports = {
    saveMessage
};