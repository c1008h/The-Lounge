import React, { useEffect, useRef, useLayoutEffect } from 'react'
import { MessageContainerProps } from './types'

export default function MessageContainer({ messages, uid, displayName }: MessageContainerProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log('messages:', messages)
    }, [messages])

    useLayoutEffect(() => {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
    }, [messages]);


    return (
        <>
            {messages?.map((message, index) => {
                const senderIsTempUser = message.sender.uid === uid;
                const senderDisplayName = senderIsTempUser ? "" : message.sender.displayName || "Unknown";
                console.log('messages:', messages)
                // const formattedTimestamp = message.timestamp.toDate().toLocaleString();
                // const formattedTimestamp = formatTimestamp(message.timestamp)
                const isLastMessage = index === messages.length - 1;

                return (
                    <div 
                        key={index} 
                        className={`flex ${message.sender.uid === uid ? 'justify-end' : 'justify-start'}`}
                        ref={isLastMessage ? messagesEndRef : null} 
                    >
                        <div className="flex flex-col max-w-3/4">
                            <p className={`text-sm ${senderIsTempUser ? 'text-right' : 'text-left'}`}>{senderDisplayName}</p>
                            <div className={`py-2 px-4 rounded-lg max-w-3/4 ${message.sender.uid === uid ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                                <p>{message.message}</p>
                            {/* <p>{formattedTimestamp}</p> */}
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
