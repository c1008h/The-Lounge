const { userRef } = require('../../config/firebaseConfig')
const admin = require('firebase-admin'); 

const searchFriend = async (friendId) => {
    try {
        if (!friendId) {
            console.error("Friend ID is undefined or null.");
            return null;
        }

        const querySnapshot = await userRef
            .where(
                admin.firestore.Filter.or(
                admin.firestore.Filter.where("uid", "==", friendId),
                admin.firestore.Filter.where("phoneNumber", "==", friendId),
                admin.firestore.Filter.where("email", "==", friendId)
                )
            )
            .get()

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data()
            console.log('friend found!')
            return userDoc
        } else {
            console.log('friend not found!')
            return null
        }
    } catch (error) {
        console.error("Error finding user with this id/email/number", error)
    }
}

const addFriend = async (userId, friend) => {
    try {
        console.log(friend)

    } catch (error) {
        console.error("error adding new user:", error)

    }
}

module.exports = {
    searchFriend, addFriend
}