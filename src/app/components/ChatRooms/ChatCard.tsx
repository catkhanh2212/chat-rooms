'use client'

import { Avatar, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useChatUserStore } from '@/app/store/chatUserStore';
import { useRelativeTime } from '@/app/hooks/useRelativeTime';
import axios from 'axios';

interface ChatCardProps {
    id: number,
    name: string,
    image: string,
    lastMessage: string,
    time: string
}

interface User {
    id: string;
    name: string;
    avatar: string;
}

interface Room {
    id: number;
    name: string;
    members: string[]; // array of userId
    lastMessage: string;
    lastMessageTime: string;
}

const selfId = '999'

function ChatCard({ id, name, image, lastMessage, time }: ChatCardProps) {
    const [room, setRoom] = useState<Room | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const setActiveRoomId = useChatUserStore((state) => state.setActiveRoomId)
    const activeRoomId = useChatUserStore((state) => state.activeRoomId)
    const duration = useRelativeTime(time)



    useEffect(() => {

        const fetchData = async () => {
            try {
                const [roomRes, usersRes] = await Promise.all([
                    axios.get<Room>(`http://localhost:3001/rooms/${id}`),
                    axios.get<User[]>(`http://localhost:3001/users`)
                ])
                setRoom(roomRes.data)
                setUsers(usersRes.data)
            } catch (err) {
                console.error("Error fetching room/users:", err)
                setRoom(null)
            }
        }

        fetchData()
    }, [id])

    // Map members -> user objects
    const memberUsers: User[] = (room?.members || [])
        .map(id => users.find(u => u.id === id))
        .filter((u): u is User => !!u)

    const otherMembers: User[] = memberUsers.filter(u => u.id !== selfId)

    // Avatar logic
    const maxAvatars = 3
    const visibleAvatars = otherMembers.slice(0, maxAvatars)
    const remaining = Math.max(0, otherMembers.length - maxAvatars)

    return (
        <Box
            onClick={() => {
                console.log("Clicked id:", id)
                setActiveRoomId(Number(id))
                console.log("Store after set:", useChatUserStore.getState().activeRoomId)
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                borderRadius: 4,
                backgroundColor: activeRoomId == id ? '#1A1A1D' : 'transparent',
                '&:hover': {
                    backgroundColor: activeRoomId == id ? '#1A1A1D' : '#2a2a2d',
                },
            }}
        >
            <Box sx={{ width: '25%' }}>
                {visibleAvatars.length === 1 && (
                    <Avatar src={otherMembers[0].avatar} alt={otherMembers[0].name} sx={{ width: 50, height: 50 }} />
                )}

                {visibleAvatars.length > 1 && (
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: visibleAvatars.length === 2 ? 'nowrap' : 'wrap',
                            gap: 0.5,
                        }}
                    >
                        {visibleAvatars.map((member) => (
                            <Avatar
                                key={member.id}
                                src={member.avatar}
                                alt={member.name}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    fontSize: 12,
                                }}
                            />
                        ))}

                        {remaining > 0 && (
                            <Avatar
                                sx={{
                                    width: 28,
                                    height: 28,
                                    fontSize: 12,
                                    bgcolor: '#799EFF',
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                            >
                                +{remaining}
                            </Avatar>
                        )}
                    </Box>
                )}


            </Box>

            <Box sx={{ display: 'flex', width: '75%', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography
                        sx={{
                            fontFamily: "Ubuntu, sans-serif",
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'white'
                        }}
                    >
                        {name}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                        <Typography sx={{ fontFamily: "Ubuntu, sans-serif", color: '#EEEEEE', fontSize: '15px' }}>
                            {duration}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    sx={{
                        fontFamily: "Ubuntu, sans-serif",
                        color: '#FBFBFB',
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis"
                    }}
                    noWrap
                >
                    {lastMessage}
                </Typography>
            </Box>
        </Box>
    )
}

export default ChatCard
