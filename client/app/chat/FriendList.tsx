import React, { useState } from 'react'
import { useFriendListener } from '@/hooks'
import { addFriend } from '@/features/friends/friendSlices'
import { useFriend } from '@/context'
import { ButtonTemplate, ModalTemplate, InputForm, BoxTemplate } from '@/components';
import { IoPersonAddSharp } from "react-icons/io5";
import { MdOutlinePending } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";

interface FriendListProps {
    userId: string;
}

export default function FriendList({ userId }: FriendListProps) {
    const [visible, setVisible] = useState(false)
    const [searchMade, setSearchMade] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [searchInput, setSearchInput] = useState<string>('')
    const { searchFriend, addAFriend, isFriendFound, successfullyAdded } = useFriend()
    const { friends, friendRequests, pendingFriends } = useFriendListener(userId);
    const [friendStatus, setFriendStatus] = useState<'pending' | 'alreadyFriends' | 'requestedInbox' | 'notFound'>('notFound');

    // console.log("friend list:", friends)

    const handleSearchInputChange = (value: string) => setSearchInput(value)

    console.log('friends:', friends)
    console.log('pending friends:', pendingFriends)
    console.log('friends request sent:', friendRequests)

    const handleSearchFriend = () => {
        const trimmedInput = searchInput.trim();
        if (!trimmedInput) return
        setSearchMade(true)
        // console.log("trimmedInput:", trimmedInput)

        if (friends.some(friend => friend.email === trimmedInput) || friends.some(friend => friend.uid === trimmedInput) || friends.some(friend => friend.phoneNumber === trimmedInput)) {
            setFriendStatus('alreadyFriends');
        } else if (friendRequests.some(request => request.email === trimmedInput) || friendRequests.some(request => request.uid === trimmedInput) || friendRequests.some(request => request.phoneNumber === trimmedInput)) {
            setFriendStatus('requestedInbox');
        } else if (pendingFriends.some(pendingFriend => pendingFriend.email === trimmedInput) || pendingFriends.some(pendingFriend => pendingFriend.uid === trimmedInput) || pendingFriends.some(pendingFriend => pendingFriend.phoneNumber === trimmedInput)) {
            setFriendStatus('pending');
        } else {
            setFriendStatus('notFound');
        }

        searchFriend(trimmedInput)
        setSearchInput('')
    }

    const handleAddFriend = () => {
        if (!userId || !isFriendFound) return
        addAFriend(userId, isFriendFound)
        setIsPending(true)
    }

    // console.log("is friend found:", isFriendFound)

    const handler = () => setVisible(true);
    const handleModalClose = () => setVisible(false)

    const renderIcon = () => {
        switch (friendStatus) {
            case 'pending':
                return <MdOutlinePending style={{ width: '25px', height: '25px' }} />;
            case 'alreadyFriends':
                return <FaUserFriends style={{ width: '25px', height: '25px' }}/>
            case 'requestedInbox':
                return <>
                    <FaCheck style={{ width: '25px', height: '25px' }}/>
                    <FaRegCircleXmark style={{ width: '25px', height: '25px' }}/>
                </>
            default:
                return <IoPersonAddSharp style={{ width: '25px', height: '25px' }} onClick={() => handleAddFriend()} />
        }
    }

    return (
        <div>
            <ButtonTemplate label='Add Friend' className='justify-center' onPress={handler}/>
            {visible && (
                <ModalTemplate
                    label="Add Friend"
                    onClose={handleModalClose}
                    visible={visible}
                >
                    <p>Search user by email, phone number or user ID.</p>
                    <InputForm 
                        onValueChange={handleSearchInputChange}
                        className=''
                        value={searchInput}
                    />
                    {searchMade && (
                        <>
                        {isFriendFound ? (
                            <div className='bg-blue-100 border border-blue-300 rounded p-4 mt-4 flex flex-row justify-between items-center'>
                                <p>Email: {isFriendFound.email}</p>
                                {/* {isPending ? ( */}
                                    <div className='flex flex-col justify-center items-center'>
                                    {renderIcon()}
                                    <p>{friendStatus === 'pending' ? 'Pending' : 'Add Friend'}</p>
                                    </div>
                                {/* ): (
                                    <IoPersonAddSharp style={{width:'25', height:'25'}} onClick={() => handleAddFriend()}/>
                                )} */}
                                {/* <MdOutlinePending />
                                <FaCheck />
                        */}
                            </div>
                        ) : (
                            <div className='bg-blue-100 border border-blue-300 rounded p-4 mt-4'>
                                <p>Not Found.</p> 
                            </div>
                        )}
                        </>
                    )}
                    <ButtonTemplate label='Search' className='justify-center' onPress={() => handleSearchFriend()}/>
                </ModalTemplate> 
            )} 
        </div>
    )
}
