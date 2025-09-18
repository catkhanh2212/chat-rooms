'use client'

import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { calculateDuration } from "../../utils/calculateDuration";
import { useChatUserStore } from '@/app/store/chatUserStore';

interface ChatCardProps {
    id: number,
    name: string,
    image: string,
    lastMessage: string,
    time: string
}

function ChatCard({ id, name, image, lastMessage, time }: ChatCardProps) {
    const setChatUserId = useChatUserStore((state) => state.setChatUserId)

    return (
        <Box  onClick={() => setChatUserId(id)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, '&:hover': {backgroundColor: '#1A1A1D'}, cursor: 'pointer', borderRadius: 4 }}>
            <Box sx={{ width: '25%' }}>
                <Avatar src={image} alt='avatar' sx={{ width: 50, height: 50 }} />
            </Box>

            <Box sx={{ display: 'flex', width: '75%', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}> {name} </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                        <Typography sx={{ color: '#EEEEEE', fontSize: '15px' }}>
                            {`${calculateDuration(time)}`}
                        </Typography>
                    </Box>
                </Box>

                <Typography sx={{ color: '#FBFBFB', overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }} noWrap>
                    {lastMessage}
                </Typography>

            </Box>
        </Box>
    )
}

export default ChatCard