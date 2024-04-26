"use client"
import React, { useState, useEffect } from 'react'
import { useParticipants, useParticipantsListener } from '@/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/features/store';
import { InputForm } from '@/components';
import { backspaceParticipant, addAParticipant } from '@/features/participants/participantSlices'
import { Friend } from '@/interfaces/Friend';
import { useSession } from '@/context/SessionContext';
import { useFriendListener } from '@/hooks'

export default function Name() {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<Friend[]>([])

    const activeSessionID = useSelector((state: RootState) => state.session.currentSession)
    const addingToChat = useSelector((state: RootState) => state.session.addToChat)
    const { currentSession, participants } = useSession()
    // const { participants, error } = useParticipantsListener()
    const { addParticipant, removeParticipant, removeSpecificParticipant } = useParticipants();

    const dispatch = useDispatch()
    const { friends} = useFriendListener();

    useEffect(() => {
        if (inputValue.length >= 3) {
            const filtered = friends.filter(friend =>
                friend.displayName.toLowerCase().includes(inputValue.toLowerCase()) ||
                friend.email.toLowerCase().includes(inputValue.toLowerCase()) ||
                friend.phoneNumber.toLowerCase().includes(inputValue.toLowerCase()) ||
                friend.uid.toLowerCase().includes(inputValue.toLowerCase())
            )

            setSuggestions(filtered)
        } else {
            setSuggestions([])
        }
    }, [inputValue, friends])

    const handleSelectParticipant = (friend: Friend) => {
        dispatch(addAParticipant(friend));
        setSuggestions([]);
    };

    const handleBackSpace = () => {
        dispatch(backspaceParticipant())
        removeParticipant()
    }

    const handleAddParticipant = (friend: Friend) => {
        const participantName = inputValue.trim();
        console.log("PART NAME:", participantName)
        // const isAlreadyAdded = participantList.some(p => p.name === participantName);
        // if (isAlreadyAdded) {
        //   setInputValue('')
        //   dispatch(removeParticipant())
        // }

        // WRITE LOGIC FOR IF USER INPUTS THE SAME PERSON
        // SHOULD EMPTY INPUT VALUE AND NOT DUPLICATE 
        if (participantName && activeSessionID) {
        // const newParticipant = { uid: '0DVpCJ7HYHMLRNT30wJd4YwV2oI3', name: participantName};
        const newParticipant = { 
            uid: friend.uid, 
            displayName: friend.displayName || '', 
            email: friend.email || '', 
            phoneNumber: friend.phoneNumber || '' 
        };

        dispatch(addAParticipant(newParticipant));
        addParticipant(activeSessionID, newParticipant);
        setInputValue(''); 
        }
    };
    console.log('typeof current participant:', typeof participants)

    console.log('current participant:', participants.displayName)
    return (
        <div className='w-full bg-gray-400' >
{Object.keys(participants).length === 1 && !addingToChat && (
    Object.values(participants).map((participant, index) => (
        <p key={index}>{participant.displayName ? participant.displayName : participant.email ? participant.email : participant.phoneNumber}</p>
    ))
)}
            {!addingToChat || participants.length != 0 && (
                participants.map((p, index) => (
                    <p>{p.displayName ? p.displayName : p.email ? p.email : p.phoneNumber}</p>
                ))
            )}
            {/* {!addingToChat || participants.length != 0 ? (
                participants.map((p, index) => (
                  <p>{p.displayName ? p.displayName : p.email ? p.email : p.phoneNumber}</p>
                ))
            ): ( */}
            {addingToChat && participants.length === 0 && (
                <InputForm
                // id="participantInput"
                    value={inputValue}
                    className=''
                    onValueChange={(value: string) => setInputValue(value)} 
                    onKeyDown={(event) => { 
                        if (event.key === 'Enter' || event.key === ' ') {
                            // handleAddParticipant(friend); 
                        } else if (event.key === 'Backspace' && !inputValue.trim()) {
                            removeParticipant();
                            handleBackSpace()
                        }
                    }}
                />
            )}
        </div>
    )
}
