"use client";
import React, { ReactNode } from "react";
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '@/provider/AuthProvider';
import { FriendProvider, SessionProvider, ParticipantsProvider, ChatProvider } from "@/context";
import { Provider } from 'react-redux';
import store from '@/features/store'

interface ProviderProps {
    children: ReactNode; 
}

export function ProviderWrapper({ children }: ProviderProps) {
  return (
        <NextUIProvider>
            <Provider store={store}>
                <AuthProvider>
                    {/* <FriendProvider>
                        <SessionProvider>
                            <ParticipantsProvider>
                                <ChatProvider> */}
                                    {/* NAV WILL GO HERE */}
                                    {children}
                                    {/* FOOTER WILL GO HERE */}
                                {/* </ChatProvider>
                            </ParticipantsProvider>
                        </SessionProvider>
                    </FriendProvider> */}
                </AuthProvider>
            </Provider>
        </NextUIProvider>
    )
}