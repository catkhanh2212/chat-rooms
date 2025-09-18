'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { EmojiEmotions, InsertPhoto, Send } from '@mui/icons-material'
import { Box, IconButton, TextField } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'

function TypeField() {
    const [text, setText] = useState('')
    const chatUserId = useChatUserStore((state) => state.chatUserId)
    const triggerRefresh = useChatUserStore((state) => state.triggerRefresh)
    const selfId = 999

    const handleSend = async () => {
        if (!text.trim()) return
        try {
            await axios.post('http://localhost:3001/messages', {
                chatId: chatUserId,
                senderId: selfId,
                text: text.trim(),
                timestamp: new Date().toISOString(),
            })

            await axios.patch(`http://localhost:3001/chats/${chatUserId}`, {
                lastMessage: text.trim(),
                lastTimestamp: new Date().toISOString(),
            })


            setText('')
            triggerRefresh() 
        } catch (err) {
            console.error('Error sending message:', err)
        }
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: '#222222', gap: 1 }}>
            <IconButton>
                <InsertPhoto sx={{ color: '#F5F5F5' }} />
            </IconButton>

            <IconButton>
                <EmojiEmotions sx={{ color: '#F5F5F5' }} />
            </IconButton>

            <TextField
                placeholder="Your message here..."
                variant="outlined"
                size="small"
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                    }
                }}
                sx={{
                    my: 1,
                    backgroundColor: '#e9eff6',
                    borderRadius: '50px',
                    '& fieldset': { border: 'none' },
                    input: { color: 'grey.700', fontSize: 14 },
                }}
            />

            <IconButton>
                <Send sx={{ color: '#F5F5F5' }} />
            </IconButton>
        </Box>
    )
}

export default TypeField