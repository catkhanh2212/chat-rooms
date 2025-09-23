'use client'

import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useChatUserStore } from '@/app/store/chatUserStore'
import { ArrowBackIos, Description } from '@mui/icons-material'

interface Message {
    id: number
    roomId: number
    senderId: number
    text: string
    timestamp: string
    fileUrl?: string
    fileType?: "raw"
    fileName: string
}

function AllFiles({ onBack }: { onBack: () => void }) {
    const activeRoomId = useChatUserStore((state) => state.activeRoomId)
    const [file, setFile] = useState<Message[]>([])

    useEffect(() => {
        if (!activeRoomId) return
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/messages?roomId=${activeRoomId}`)
                const allMsgs: Message[] = res.data
                const sorted = [...allMsgs].sort(
                    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )
                const mediaMsgs = sorted.filter(
                    (msg) => msg.text === '[Document]'
                )
                setFile(mediaMsgs)
            } catch (err) {
                console.error("Error fetching media:", err)
            }
        }
        fetchMessages()
    }, [activeRoomId])


    return (
        <Box sx={{ backgroundColor: '#1A1A1D', height: '100%', p: 2 }}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', height: 50, pb: 4, pt: 2 }}>
                <ArrowBackIos onClick={onBack} sx={{ color: 'white', fontSize: '18px', position: 'absolute', left: 0, cursor: 'pointer' }} />

                <Typography
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white',
                        fontFamily: "Ubuntu, sans-serif",
                    }}
                >
                    Storage
                </Typography>
            </Box>




            <Box >
                {file.map((msg) => (
                    <Box key={msg.id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, cursor: 'pointer' }}>
                        <Description sx={{ color: "white" }} />
                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "underline" }}>
                            {msg.fileName}
                        </a>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default AllFiles
