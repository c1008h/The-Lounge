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
        console.log("add friend:", friend)
        const { uid, displayName, email, phoneNumber } = friend;

        const userSnapshot = await userRef.where("uid", "==", userId).get()
        if (userSnapshot.empty) {
            console.log("user not found")
            return false
        }

        const userDoc = userSnapshot.docs[0];
        const sentFriendRequests = userDoc.exists ? userDoc.data().sentFriendRequests || [] : [];
        sentFriendRequests.push({ uid: uid, displayName: displayName || null, email: email || null, phoneNumber: phoneNumber || null });
        await userRef.doc(userDoc.id).update({ sentFriendRequests });

        const friendSnapshot = await userRef.where("uid", "==", friend.uid).get()
        if (friendSnapshot.empty) {
            console.log("Friend not found");
            return false;
        }

        const friendDoc = friendSnapshot.docs[0];
        const friendRequests = friendDoc.data().friendRequests || [];
        const userData = {
            uid: userId,
            displayName: userDoc.data().displayName || null,
            email: userDoc.data().email || null,
            phoneNumber: userDoc.data().phoneNumber || null
        };
        friendRequests.push(userData);
        await userRef.doc(friendDoc.id).update({ friendRequests });
        console.log("Friend request sent successfully to the friend");

        return true;
    } catch (error) {
        console.error("error adding new user:", error)
        return false;
    }
}

module.exports = {
    searchFriend, addFriend
}