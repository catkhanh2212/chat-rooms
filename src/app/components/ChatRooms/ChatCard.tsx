'use client'

import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { useChatUserStore } from '@/app/store/chatUserStore';
import { useRelativeTime } from '@/app/hooks/useRelativeTime';

interface ChatCardProps {
    id: number,
    name: string,
    image: string,
    lastMessage: string,
    time: string
}

function ChatCard({ id, name, image, lastMessage, time }: ChatCardProps) {
    const setChatUserId = useChatUserStore((state) => state.setChatUserId)
    const chatUserId = useChatUserStore((state) => state.chatUserId)
    const duration = useRelativeTime(time)


    return (
        <Box
            onClick={() => setChatUserId(id)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                borderRadius: 4,
                backgroundColor: chatUserId === id ? '#1A1A1D' : 'transparent',
                '&:hover': {
                    backgroundColor: chatUserId === id ? '#1A1A1D' : '',
                },
            }}
        >

            <Box sx={{ width: '25%' }}>
                <Avatar src={image} alt='avatar' sx={{ width: 50, height: 50 }} />
            </Box>

            <Box sx={{ display: 'flex', width: '75%', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography sx={{ fontFamily: "Ubuntu, sans-serif", fontSize: '16px', fontWeight: 'bold', color: 'white' }}> {name} </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                        <Typography sx={{ fontFamily: "Ubuntu, sans-serif", color: '#EEEEEE', fontSize: '15px' }}>
                            {duration}
                        </Typography>
                    </Box>
                </Box>

                <Typography sx={{ fontFamily: "Ubuntu, sans-serif", color: '#FBFBFB', overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }} noWrap>
                    {lastMessage}
                </Typography>

            </Box>
        </Box>
    )
}

export default ChatCard