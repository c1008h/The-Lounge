import React, { useState, useRef, useEffect } from 'react'
import { useFriendListener, useFriend } from '@/hooks'
import { addFriend } from '@/features/friends/friendSlices'
import { ButtonTemplate, ModalTemplate, InputForm, BoxTemplate, DropDownMenu } from '@/components';
import { IoPersonAddSharp } from "react-icons/io5";
import { MdOutlinePending } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { LiaUserEditSolid } from "react-icons/lia";
import { FaRegMessage } from "react-icons/fa6";

interface FriendListProps {
    userId: string;
    visible: boolean;
    setVisible: (value: boolean) => void;
}

export default function FriendList({ userId, visible, setVisible  }: FriendListProps) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const [searchMade, setSearchMade] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [searchInput, setSearchInput] = useState<string>('')
    const { 
        searchFriend,
        addAFriend, 
        deleteAFriend,
        isFriendFound, 
        successfullyAdded,
        acceptFriendsRequest,
        declineFriendRequest,
        cancelFriendRequest
    } = useFriend()
    const { friends, friendRequests, pendingFriends } = useFriendListener(userId);
    const [friendStatus, setFriendStatus] = useState<'pending' | 'alreadyFriends' | 'requestedInbox' | 'notFound'>('notFound');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
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
        console.log("Friend status:", friendStatus)
        switch (friendStatus) {
            case 'pending':
                return <MdOutlinePending style={{ width: '25px', height: '25px' }} />;
            case 'alreadyFriends':
                return <FaUserFriends style={{ width: '25px', height: '25px' }}/>
            case 'requestedInbox':
                return <div className='flex flex-row justify-evenly'>
                    <FaCheck 
                        style={{ width: '25px', height: '25px' }}
                        onClick={() => {
                            if (isFriendFound) {
                                acceptFriendsRequest(userId, isFriendFound.uid)
                            } else {
                                console.error("Friend not found.");
                            }
                        }}
                    />
                    <FaRegCircleXmark 
                        style={{ width: '25px', height: '25px' }}
                        onClick={() => {
                            if (isFriendFound) {
                                declineFriendRequest(userId, isFriendFound.uid)
                            } else {
                                console.error("Friend not found.");
                            }
                        }}
                    />
                </div>
            default:
                return <IoPersonAddSharp 
                            style={{ width: '25px', height: '25px' }} 
                            onClick={() => handleAddFriend()} 
                        />
        }
    }

    return (
        <>
            <div className="section bg-gray-200 rounded p-4">
                <h3 className="text-lg font-semibold">ALL FRIENDS - {friends.length}</h3>
                {friends && friends.map(friend => (
                    <div key={friend.uid} className='flex flex-row justify-between items-center'>
                        <p>{friend.displayName ? friend.displayName : friend.email ? friend.email : friend.phoneNumber}</p>
                        <div className='flex flex-row items-center'>
                            <FaRegMessage 
                                style={{ width: '25px', height: '25px', marginLeft:'5px' }}
                            />
                            <LiaUserEditSolid 
                                style={{ width: '25px', height: '25px', marginLeft:'5px'}}
                                onClick={() => deleteAFriend(userId, friend.uid)}
                            />
                        </div>
                        {/* {showDropdown && ( */}
        {/* // <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        // <button onClick={() => handleEditFriendDisplayName(friend.uid)}>Edit</button>
        //                         <button onClick={() => handleDeleteFriend(friend.uid)}>Delete</button>
        //                         <button >Block</button>

        //                     </div>
        // <DropDownMenu />
                        )} */}
                    </div>
                ))}
            </div>
            <div className="section bg-gray-200 p-4">
                <h3 className="text-lg font-semibold">REQUEST - {friendRequests.length}</h3>
                {friendRequests && friendRequests.map((requested => (
                    <div key={requested.uid} className='flex flex-row justify-between'>
                        <p>{requested.displayName ? requested.displayName : requested.email ? requested.email : requested.phoneNumber}</p>
                        <div className='flex flex-row'>
                            <FaCheck 
                                style={{ width: '25px', height: '25px' }}
                                onClick={() => acceptFriendsRequest(userId, requested.uid)}
                            />
                            <FaRegCircleXmark 
                                style={{ width: '25px', height: '25px' }}
                                onClick={() => declineFriendRequest(userId, requested.uid)}
                            />
                        </div>
                    </div>
                )))}
            </div>
            <div className="section bg-gray-200 rounded p-4">
                <h3 className="text-lg font-semibold">PENDING - {pendingFriends.length}</h3>
                {pendingFriends && pendingFriends.map((pending => (
                    <div key={pending.uid} className='flex flex-row justify-between'>
                        <p>{pending.displayName ? pending.displayName : pending.email ? pending.email : pending.phoneNumber}</p>
                        <MdOutlinePending style={{ width: '25px', height: '25px' }} />
                        <FaRegCircleXmark 
                            style={{ width: '25px', height: '25px' }}
                            onClick={() => cancelFriendRequest(userId, pending.uid)}
                        />
                    </div>
                )))}
            </div>
            {visible && (
                <ModalTemplate
                    label="Add Friend"
                    onClose={handleModalClose}
                    visible={visible}
                    canClose={true}
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
        </>
    )
}
