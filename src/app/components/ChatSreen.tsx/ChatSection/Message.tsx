/* eslint-disable @next/next/no-img-element */
'use client'

import { Avatar, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { formatDate } from "../../../utils/formatDate";
import axios from 'axios';

interface MessageProps {
    id: number;
    chatId: number;
    senderId: number;
    text: string;
    timestamp: string;
    image: string;
}

function Message({ senderId, text, image, timestamp }: MessageProps) {
    const selfId = 999
    const [senderAvatar, setSenderAvatar] = useState<string | null>(null)

    useEffect(() => {
        const fetchSenderAvatar = async () => {
            try {
                const res = await axios.get<{ id: number; name: string; avatar: string }>(
                    `http://localhost:3001/users/${senderId}`
                )
                setSenderAvatar(res.data.avatar)
            } catch (err) {
                console.error("Error fetching user:", err)
            }
        }

        fetchSenderAvatar()
    }, [senderId])

    return (
        <Box sx={{ py: 2 }}>
            <Typography sx={{ textAlign: 'center', color: '#F5F7F8' }}>
                {formatDate(timestamp)}
            </Typography>

            {senderId !== selfId && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                    <Avatar src={senderAvatar ?? "/default.png"} alt="avatar" />
                    <Box sx={{ p: 2, backgroundColor: '#212121', borderRadius: 2 }}>
                        <Typography sx={{ color: 'white', ml: 1 }}>{text}</Typography>

                        {image && (
                            <img
                                src={image}
                                alt="uploaded"
                                style={{ maxWidth: "200px", borderRadius: "8px" }}
                            />
                        )}

                    </Box>

                </Box>
            )}

            {senderId == selfId && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, my: 2 }}>
                    <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                        {text !== '[Image]' && (
                            <Typography sx={{ color: 'black', ml: 1 }}>{text}</Typography>
                        )}


                        {image && (
                            <img
                                src={image}
                                alt="uploaded"
                                style={{ maxWidth: "200px", borderRadius: "8px" }}
                            />
                        )}
                    </Box>
                    <Avatar src={senderAvatar ?? "/default.png"} alt="avatar" />
                </Box>
            )}
        </Box>
    )
}

export default Message
