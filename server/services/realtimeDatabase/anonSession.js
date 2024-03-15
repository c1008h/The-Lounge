const { chatSessionsRef, realTimeDb  } = require('../../config/firebaseConfig')

const createSessionAnon = async () => {
    try {
        const chatSessionRef = chatSessionsRef.push();
        const chatSessionId = chatSessionRef.key;
        const timestamp = Date.now();
        const formattedDate = new Date(timestamp).toISOString();

        const chatSessionData = {
            created: formattedDate,
            participants: [userId]
        }

        await chatSessionsRef.once('value', snapshot => {
            if (!snapshot.exists()) {
                chatSessionsRef.set({});
            }
        });

        // await chatSessionRef.set(chatSessionData)
        await chatSessionsRef.child(chatSessionId).set(chatSessionData);

        console.log('New chat session created with ID:', chatSessionId);

        return chatSessionId;
    } catch (error) {
        console.error('Error creating chat session:', error);
        throw error;
    }
}

module.exports = {
    createSessionAnon
};