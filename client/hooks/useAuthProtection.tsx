"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/provider/AuthProvider'
import { useSocket } from '.'

export default function useAuthProtection() {
    const { currentUser } = useAuth()
    const [loading, setLoading] = useState<boolean>(true)

    // const { connect } = useSocket(token)

    useEffect(() => {
        console.log("CURRENT USER:", currentUser)
        if (currentUser === null || currentUser === undefined) {
            window.location.href = '/login';
        } else {
            // connect()
            setLoading(false);
        }
    }, [currentUser])


    return { loading }
}
