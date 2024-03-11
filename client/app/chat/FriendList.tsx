import React, { useState } from 'react'
import { useFriendListener } from '@/hooks'
import { addFriend } from '@/features/friends/friendSlices'
import { useFriend } from '@/context'
// import { addAFriend, deleteAFriend, searchFriend } from '@/context'
import { ButtonTemplate, ModalTemplate, InputForm } from '@/components';

interface FriendListProps {
    userId: string;
}

export default function FriendList({ userId }: FriendListProps) {
    const [visible, setVisible] = useState(false)
    const [searchInput, setSearchInput] = useState<string>('')
    const { searchFriend, isFriendFound } = useFriend()
    const { friends } = useFriendListener(userId);

    // console.log("friend list:", friends)
    // const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleSearchInputChange = (value: string) => setSearchInput(value)

    const handleAddFriend = () => {
        const trimmedInput = searchInput.trim();
        if (!trimmedInput) return

        console.log("trimmedInput:", trimmedInput)
        searchFriend(trimmedInput)
    }

    console.log("is friend found:", isFriendFound)

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
                    <ButtonTemplate label='Search' className='justify-center' onPress={() => handleAddFriend()}/>
                </ModalTemplate> 
            )} 
        </div>
    )
}
