/* eslint-disable @next/next/no-img-element */
'use client'

import { Box, Typography, Dialog } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useChatUserStore } from '@/app/store/chatUserStore'
import { ArrowBackIos } from '@mui/icons-material'

interface Message {
    id: number
    chatId: number
    senderId: number
    text: string
    timestamp: string
    fileUrl?: string
    fileType?: "image" | "video"
    fileName: string
}

function AllMedia({ onBack }: { onBack: () => void }) {
    const chatUserId = useChatUserStore((state) => state.chatUserId)
    const [media, setMedia] = useState<Message[]>([])
    const [selectedMedia, setSelectedMedia] = useState<Message | null>(null)

    useEffect(() => {
        if (!chatUserId) return
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/messages?chatId=${chatUserId}`)
                const allMsgs: Message[] = res.data
                const sorted = [...allMsgs].sort(
                    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )
                const mediaMsgs = sorted.filter(
                    (msg) => msg.text === '[Image]' || msg.text === '[Video]'
                )
                setMedia(mediaMsgs)
            } catch (err) {
                console.error("Error fetching media:", err)
            }
        }
        fetchMessages()
    }, [chatUserId])

    const getVideoThumbnail = (url: string) => {
        return url
            .replace('/upload/', '/upload/so_0/') // lấy frame đầu tiên
            .replace(/\.(mp4|mov|avi|webm)$/, '.jpg') // đổi đuôi sang jpg
    }

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




            <Box display='grid' sx={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {media.map((msg) => (
                    <Box key={msg.id} sx={{ cursor: 'pointer' }} onClick={() => setSelectedMedia(msg)}>
                        {msg.fileType === "image" ? (
                            <img src={msg.fileUrl} alt="img" style={{ width: '100%', borderRadius: '3px' }} />
                        ) : msg.fileType === "video" ? (
                            <img
                                src={getVideoThumbnail(msg.fileUrl!)}
                                alt="video thumbnail"
                                style={{ width: '100px', height: '100px', borderRadius: '3px', objectFit: 'cover' }}
                            />
                        ) : null}
                    </Box>
                ))}
            </Box>

            <Dialog
                open={!!selectedMedia}
                onClose={() => setSelectedMedia(null)}
                maxWidth="lg"
                PaperProps={{
                    sx: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {selectedMedia && (
                        <>
                            {selectedMedia.fileType === "image" ? (
                                <img
                                    src={selectedMedia.fileUrl!}
                                    alt="full"
                                    style={{
                                        maxWidth: '90vw',
                                        maxHeight: '90vh',
                                        borderRadius: '8px',
                                    }}
                                />
                            ) : selectedMedia.fileType === "video" ? (
                                <video
                                    src={selectedMedia.fileUrl!}
                                    controls
                                    autoPlay
                                    style={{
                                        maxWidth: '90vw',
                                        maxHeight: '90vh',
                                        borderRadius: '8px',
                                    }}
                                />
                            ) : null}

                        </>
                    )}
                </Box>
            </Dialog>
        </Box>
    )
}

export default AllMedia
