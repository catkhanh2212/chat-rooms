'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { Avatar, AvatarGroup, Box, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import FileList from './FileList'
import AllMedia from './AllMedia'
import AllFiles from './AllFiles'

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

const selfId = "999";


function Info() {

    const activeRoomId = useChatUserStore((state) => state.activeRoomId)
    const [users, setUsers] = useState<User[]>([])
    const [room, setRoom] = useState<Room | null>(null)
    const [showAllMedia, setShowAllMedia] = useState(false)
    const [showAllFiles, setShowAllFiles] = useState(false)

    useEffect(() => {
        if (!activeRoomId) {
            setRoom(null)
            return
        }

        const fetchData = async () => {
            try {
                const [roomRes, usersRes] = await Promise.all([
                    axios.get<Room>(`http://localhost:3001/rooms/${activeRoomId}`),
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
    }, [activeRoomId])

    if (!room) return null

    // Map members -> user objects
    const memberUsers = room.members
        .map(id => users.find(u => u.id === id))
        .filter((u): u is User => !!u)

    // Bỏ self
    const otherMembers = memberUsers.filter(u => u.id !== selfId)

    const maxAvatars = 3
    const visibleAvatars = otherMembers.slice(0, maxAvatars)
    const remaining = otherMembers.length - maxAvatars

    if (showAllMedia) {
        return <AllMedia onBack={() => setShowAllMedia(false)} />
    }

    if (showAllFiles) {
        return <AllFiles onBack={() => setShowAllFiles(false)} />
    }

    return (

        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#1E201E' }}>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    {/* Avatar hiển thị */}
                    {visibleAvatars.length === 1 && (
                        <Avatar src={otherMembers[0].avatar} alt={otherMembers[0].name} sx={{ width: 50, height: 50 }} />
                    )}

                    {visibleAvatars.length > 1 && (
                        <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 45, height: 45, fontSize: 14 } }}>
                            {visibleAvatars.map(member => (
                                <Avatar key={member.id} src={member.avatar} alt={member.name} />
                            ))}

                            {remaining > 0 && (
                                <Avatar sx={{ width: 40, height: 40, fontSize: 14, bgcolor: '#799EFF', color: 'black', fontWeight: 'bold' }}>
                                    +{remaining}
                                </Avatar>
                            )}
                        </AvatarGroup>
                    )}
                </Box>

                <Typography sx={{ fontFamily: "Ubuntu, sans-serif", color: 'white', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                    {otherMembers.length === 1
                        ? otherMembers[0].name
                        : room.name
                    }
                </Typography>
            </Box>



            <Box sx={{ flex: 1, height: '100%', overflowY: 'auto' }}>
                <FileList onMoreClick={() => setShowAllFiles(true)} />
            </Box>
        </Box>
    )
}

export default Info