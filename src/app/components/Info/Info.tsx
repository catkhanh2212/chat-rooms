'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { Avatar, Box, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface User {
    id: number;
    name: string;
    avatar: string;
}


function Info() {

    const chatUserId = useChatUserStore((state) => state.chatUserId)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (!chatUserId) {
            setUser(null)
            return
        }

        const fetchUser = async () => {
            try {
                const res = await axios.get<User>(`http://localhost:3001/users/${chatUserId}`)
                setUser(res.data)
            } catch (err) {
                console.error("Error fetching user:", err)
                setUser(null)
            }
        }

        fetchUser()
    }, [chatUserId])
    return (

        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, backgroundColor: '#212121' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Avatar src={user?.avatar} alt='avatar' sx={{ width: '72px', height: '72px' }} />
            </Box>

            <Typography sx={{ color: 'white', fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}> {user?.name} </Typography>
        </Box>
    )
}

export default Info