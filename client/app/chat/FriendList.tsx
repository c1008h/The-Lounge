import React from 'react'
import { useFriendListener } from '@/hooks'
import { addFriend } from '@/features/friends/friendSlices'
import { addAFriend, deleteAFriend } from '@/context'

interface FriendListProps {
    userId: string;
}

export default function FriendList({ userId }: FriendListProps) {
    const { friends } = useFriendListener(userId);
    console.log("friend list:", friends)

    return (
        <div>
            friends
        </div>
    )
}
