'use client'

import { Search } from '@mui/icons-material'
import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ChatCard from './ChatCard';
import { useChatUserStore } from '@/app/store/chatUserStore';

interface User {
    id: number;
    name: string;
    avatar: string;
}

interface Chat {
    id: number;
    userId: number;
    lastMessage: string;
    status?: string;
    time: string;
}


function ChatRooms() {
    const [chats, setChats] = useState<(Chat & { user?: User })[]>([])
    const refreshMessages = useChatUserStore((state) => state.refreshMessages)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, chatsRes] = await Promise.all([
                    axios.get<User[]>("http://localhost:3001/users"),
                    axios.get<Chat[]>("http://localhost:3001/chats"),
                ])


                const merged = chatsRes.data
                    .map(chat => {
                        const user = usersRes.data.find(u => String(u.id) === String(chat.userId))
                        return { ...chat, user }
                    })
                    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())



                setChats(merged)

                console.log(merged)
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [refreshMessages])
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, backgroundColor: '#212121' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: "Ubuntu, sans-serif", fontSize: '20px', fontWeight: 'bold', color: 'white' }}> Chats </Typography>
            </Box>

            <TextField
                placeholder="Search contact / chat"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: "grey.600" }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    my: 2,
                    backgroundColor: "#e9eff6",
                    borderRadius: "50px",
                    "& fieldset": { border: "none" },
                    input: { color: "grey.700", fontSize: 14 },
                }}
            />

            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                pr: 1,
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#555',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#777',
                },
            }}>
                {chats.map((chat) => (
                    <ChatCard
                        key={chat.id}
                        id={chat.user?.id ?? 0}
                        name={chat.user?.name ?? "Unknown"}
                        image={chat.user?.avatar ?? "/default.png"}
                        lastMessage={chat.lastMessage ?? "Unknown"}
                        time={chat.time} />
                ))}
            </Box>
        </Box>
    )
}

export default ChatRooms