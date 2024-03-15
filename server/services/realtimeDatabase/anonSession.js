const { anonSessionRef, realTimeDb  } = require('../../config/firebaseConfig')
const { createUniqueId } = require('../../utils/tempIdGenerator')

const createSessionAnon = async () => {
    try {
        const userId = createUniqueId()
        
        const anonSession = anonSessionRef.push();
        const chatSessionId = anonSession.key;
        const timestamp = Date.now();
        const formattedDate = new Date(timestamp).toISOString();

        const chatSessionData = {
            created: formattedDate,
            participants: [userId]
        }

        await anonSessionRef.once('value', snapshot => {
            if (!snapshot.exists()) {
                anonSessionRef.set({});
            }
        });

        await anonSessionRef.child(chatSessionId).set(chatSessionData);

        console.log('New chat session created with ID:', chatSessionId);

        return chatSessionId;
    } catch (error) {
        console.error('Error creating chat session:', error);
        throw error;
    }
}

const addToAnonSession = async (user, sessionId) => {
    try {
        if (!sessionId || !user) throw error ("empty session id or empty participant")
        
        const chatSessionDataSnapshot = await anonSessionRef.child(sessionId).once('value');
        const chatSessionData = chatSessionDataSnapshot.val();

        let participants = [];

        if (chatSessionData && chatSessionData.participants) {
            participants = chatSessionData.participants
        }
        
        participants.push(user)

        await anonSessionRef.child(sessionId).update({ user });

        console.log('Participant added to chat session:', user);

    } catch (error) {
        console.error('Error adding participant to session:', error);
        throw error;
    }
}

const deleteSession = async (sessionId) => {

}

module.exports = {
    createSessionAnon,
    addToAnonSession
};