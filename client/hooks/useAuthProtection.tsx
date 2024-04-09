"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/provider/AuthProvider'

export default function useAuthProtection() {
    const { currentUser } = useAuth()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        console.log("CURRENT USER:", currentUser)
        if (currentUser === null || currentUser === undefined) {
            window.location.href = '/login';
        } else {
            setLoading(false);
        }
    }, [currentUser])


    return { loading }
}
