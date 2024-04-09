"use client"
import React, { useState } from 'react'
import { SocketProvider } from '@/provider/SocketProvider'
import Sidebar from './Sidebar'
import { Navbar, Loading } from '@/components'
import useAuthProtection from '@/hooks/useAuthProtection'

export default function Layout({ children }: { children: React.ReactNode }) {
    const [fullSize, setFullSize] = useState<boolean>(true)
    const { loading: authLoading } = useAuthProtection()

    if (authLoading) return <Loading message={'Authenticating...'}/>

    return (
        <SocketProvider>
            <>
                <Sidebar fullSize={fullSize} setFullSize={setFullSize}/>
                <div className={`transition-transform duration-300 ${fullSize ? 'ml-64' : 'ml-0'}`}>
                    <Navbar/>
                    {children}
                </div>
            </>
        </SocketProvider>
    )
}
