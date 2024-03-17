const { anonSessionRef  } = require('../../config/firebaseConfig')
const { createUniqueId } = require('../../utils/tempIdGenerator')
const admin = require('firebase-admin');

const createSessionAnon = async () => {
    try {
        const userId = createUniqueId()

        const anonSession = anonSessionRef.push();
        const chatSessionId = anonSession.key;
        // const timestamp = Date.now();
        // const formattedDate = new Date(timestamp).toISOString();

        const chatSessionData = {
            created: admin.database.ServerValue.TIMESTAMP
            // participants: [userId]
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

const addToAnonSession = async (displayName, sessionId) => {
    try {
        const userId = createUniqueId()
        console.log('display name:', displayName)
        console.log('session id:', sessionId)

        if (!sessionId || !displayName) throw error ("empty session id or empty participant")
        
        const chatSessionDataSnapshot = await anonSessionRef.child(sessionId).once('value');
        const chatSessionData = chatSessionDataSnapshot.val();

        // let participants = [];

        // if (chatSessionData && chatSessionData.participants) {
        //     participants = chatSessionData.participants
        // }
        let participants = Array.isArray(chatSessionData?.participants) ? chatSessionData.participants : [];

        participants.push({ uid: userId, displayName: displayName })

        await anonSessionRef.child(sessionId).update({ participants });

        console.log(`Participant ${userId} added to anon chat session`);

        return userId
    } catch (error) {
        console.error('Error adding participant to session:', error);
        throw error;
    }
}

const saveAnonMessage = async (sessionId, msg) => {
    try {
        if (!msg || !sessionId) return

        console.log("message in saveMessage function:", msg)
        console.log("sessionId in saveMessage function:", sessionId)
    
        const anonRef = anonSessionRef.child(sessionId);
        const chatSessionDataSnapshot = await anonRef.once('value');
        const chatSessionData = chatSessionDataSnapshot.val();

        let messages = chatSessionData && chatSessionData.messages ? [...chatSessionData.messages] : [];

        messages.push({
            message: msg.message,
            sender: msg.sender.uid,
            timestamp: admin.database.ServerValue.TIMESTAMP
        });

        await anonRef.update({ messages });

        console.log('Message saved to Firebase chat session');
    } catch (error) {
        console.error('Error saving message to Firebase:', error);
        throw error; 
    }
}

const removeAnonFromSession = async (userId, sessionId) => {
    try {
        console.log("userId", userId)
        const sessionSnapshot = await anonSessionRef.child(sessionId).once('value');
        if (!sessionSnapshot.exists()) {
            throw new Error('Session does not exist');
        }
        const sessionData = sessionSnapshot.val();
        let participants = sessionData.participants || [];
        participants = participants.filter(participant => participant.uid !== userId.uid);
        await anonSessionRef.child(sessionId).child('participants').set(participants);

        console.log('Chat session deleted from real-time database.');
    } catch (error) {
        console.error('Error deleting chat session from real-time database:', error);
        throw error
    }
}

const deleteSession = async (sessionId) => {
    try {
        await anonSessionRef.child(sessionId).remove();
        console.log('Chat session deleted from real-time database.');
    } catch (error) {
        console.error('Error deleting chat session from real-time database:', error);
        throw error
    }
}

module.exports = {
    createSessionAnon,
    addToAnonSession,
    saveAnonMessage,
    removeAnonFromSession,
    deleteSession
};