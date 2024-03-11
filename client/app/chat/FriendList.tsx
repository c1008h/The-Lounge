import React, { useState } from 'react'
import { useFriendListener } from '@/hooks'
import { addFriend } from '@/features/friends/friendSlices'
import { useFriend } from '@/context'
// import { addAFriend, deleteAFriend, searchFriend } from '@/context'
import { ButtonTemplate, ModalTemplate, InputForm, BoxTemplate } from '@/components';
import { IoPersonAddSharp } from "react-icons/io5";
import { MdOutlinePending } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

interface FriendListProps {
    userId: string;
}

export default function FriendList({ userId }: FriendListProps) {
    const [visible, setVisible] = useState(false)
    const [searchMade, setSearchMade] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [searchInput, setSearchInput] = useState<string>('')
    const { searchFriend, addAFriend, isFriendFound, successfullyAdded } = useFriend()
    const { friends } = useFriendListener(userId);

    // console.log("friend list:", friends)
    // const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleSearchInputChange = (value: string) => setSearchInput(value)

    const handleSearchFriend = () => {
        const trimmedInput = searchInput.trim();
        if (!trimmedInput) return
        setSearchMade(true)
        console.log("trimmedInput:", trimmedInput)
        searchFriend(trimmedInput)
        setSearchInput('')
    }

    const handleAddFriend = () => {
        if (!userId || !isFriendFound) return
        addAFriend(userId, isFriendFound)
        setIsPending(true)
    }

    console.log("is friend found:", isFriendFound)
    console.log("Successfully added?:", successfullyAdded)

    const handler = () => setVisible(true);
    const handleModalClose = () => setVisible(false)



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
                                {isPending ? (
                                    <div className='flex flex-col justify-center items-center'>
                                        <MdOutlinePending style={{width:'25', height:'25'}}/>
                                        <p>Pending</p>
                                    </div>
                                ): (
                                    <IoPersonAddSharp style={{width:'25', height:'25'}} onClick={() => handleAddFriend()}/>
                                )}
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
