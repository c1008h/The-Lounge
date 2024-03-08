"use client";
import React, { ReactNode } from "react";
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '@/provider/AuthProvider';
import { SessionProvider } from "@/context/SessionContext";
import { ParticipantsProvider } from "@/context/ParticipantsContext";
import { ChatProvider } from "@/context/ChatContext";
interface ProviderProps {
    children: ReactNode; 
}

export function Provider({ children }: ProviderProps) {
  return (
    <NextUIProvider >
        <AuthProvider>
            <SessionProvider>
                <ParticipantsProvider>
                    <ChatProvider>
                        {/* NAV WILL GO HERE */}
                        {children}
                        {/* FOOTER WILL GO HERE */}
                    </ChatProvider>
                </ParticipantsProvider>
            </SessionProvider>
        </AuthProvider>
    </NextUIProvider>
    )
}