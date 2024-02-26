const { userRef } = require('../../config/firebaseConfig')
const admin = require('firebase-admin'); 

const addNewUser = async (userId, userData) => {
    try {
        await userRef.doc(userId).set(userData)
        console.log(`New user added with ID: ${userId}`);
    } catch (error) {
        console.error("error adding new user:", error)
    }
}

const updateUser = async (userId, updates) => {
    try {
        await userRef.doc(userId).update(updates);
        console.log(`User ${userId} updated successfully.`);
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

const addChatSessionToUser = async (userId, chatSessionId) => {
    try {
        const userIdRef = userRef.doc(userId)
        await userIdRef.update({
            sessions: admin.firestore.FieldValue.arrayUnion(chatSessionId)
        })

        console.log(`Chat session ${chatSessionId} added to user ${userId}.`);
    } catch (error) {
        console.error(`Error adding chat session to user ${userId}:`, error);
    }
}

const userHasChatSession = async (userId, chatSessionId) => {
    const userDocRef = userRef.doc(userId);
    const doc = await userDocRef.get();
    if (!doc.exists) {
        console.log('No such user found!');
        return false;
    }
    const userData = doc.data();
    return userData.sessions && userData.sessions.includes(chatSessionId);
};

module.exports = {
    addNewUser, updateUser, addChatSessionToUser, userHasChatSession
}