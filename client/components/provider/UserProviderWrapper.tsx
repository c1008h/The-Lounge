"use client";
import React, { ReactNode } from "react";
import { FriendProvider, SessionProvider, ParticipantsProvider, ChatProvider } from "@/context";

interface ProviderProps {
    children: ReactNode; 
}

export function UserProviderWrapper({ children }: ProviderProps) {
  return (
        <FriendProvider>
            <SessionProvider>
                <ParticipantsProvider>
                    <ChatProvider>
                        {/* NAV WILL GO HERE */}
                        {children}
                        {/* FOOTER WILL GO HERE */}
                    </ChatProvider>
                </ParticipantsProvider>
            </SessionProvider>
        </FriendProvider>
    )
}