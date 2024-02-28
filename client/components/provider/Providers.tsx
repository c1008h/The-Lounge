"use client";
import React, { ReactNode } from "react";
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '@/provider/AuthProvider';

interface ProviderProps {
    children: ReactNode; 
}

export function Provider({ children }: ProviderProps) {
  return (
    <NextUIProvider >
        <AuthProvider>
            {/* NAV WILL GO HERE */}
            {children}
            {/* FOOTER WILL GO HERE */}
        </AuthProvider>
    </NextUIProvider>
    )
}