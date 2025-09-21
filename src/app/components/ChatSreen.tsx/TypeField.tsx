'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { EmojiEmotions, InsertPhoto, Send } from '@mui/icons-material'
import { Box, ClickAwayListener, IconButton, TextField } from '@mui/material'
import axios from 'axios'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import React, { useRef, useState } from 'react'

function TypeField() {
    const [text, setText] = useState('')
    const chatUserId = useChatUserStore((state) => state.chatUserId)
    const triggerRefresh = useChatUserStore((state) => state.triggerRefresh)
    const selfId = 999

    const [showEmoji, setShowEmoji] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // Gửi text message
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


    const handleOpenFilePicker = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0]
      
          try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", "chat-unsigned")
      
            let resourceType: "image" | "video" | "raw" = "raw"
            if (file.type.startsWith("image/")) resourceType = "image"
            else if (file.type.startsWith("video/")) resourceType = "video"
      
            const uploadRes = await axios.post(
              `https://api.cloudinary.com/v1_1/difopsd0p/${resourceType}/upload`,
              formData
            )
      
            const fileUrl = uploadRes.data.secure_url
            const originalName = file.name
      
            let displayText = "[File]"
            if (resourceType === "image") displayText = "[Image]"
            else if (resourceType === "video") displayText = "[Video]"
            else {
              if (file.name.endsWith(".pdf")) displayText = "[PDF]"
              else if (file.name.endsWith(".doc") || file.name.endsWith(".docx"))
                displayText = "[Document]"
            }
      
            await axios.post("http://localhost:3001/messages", {
              chatId: chatUserId,
              senderId: selfId,
              text: displayText,
              fileUrl,                         // link Cloudinary
              fileType: resourceType,          // image, video, raw
              fileName: originalName,
              timestamp: new Date().toISOString(),
            })
      
            await axios.patch(`http://localhost:3001/chats/${chatUserId}`, {
              lastMessage: displayText,
              lastTimestamp: new Date().toISOString(),
            })
      
            triggerRefresh()
          } catch (err) {
            console.error("Error uploading to Cloudinary:", err)
          }
        }
      }
      
      


    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setText((prev) => prev + emojiData.emoji)
    }

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                backgroundColor: '#222222',
                gap: 1,
                position: 'relative',
            }}
        >
            <IconButton onClick={handleOpenFilePicker}>
                <InsertPhoto sx={{ color: '#F5F5F5' }} />
            </IconButton>

            <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
            />


            {/* Emoji Picker toggle */}
            <IconButton onClick={() => setShowEmoji((prev) => !prev)}>
                <EmojiEmotions sx={{ color: '#F5F5F5' }} />
            </IconButton>

            {/* Text Input */}
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

            {/* Send Button */}
            <IconButton onClick={handleSend}>
                <Send sx={{ color: '#F5F5F5' }} />
            </IconButton>

            {/* Emoji Picker */}
            {showEmoji && (
                <ClickAwayListener onClickAway={() => setShowEmoji(false)}>
                    <Box sx={{ position: 'absolute', bottom: '60px', left: '50px', zIndex: 1000 }}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </Box>
                </ClickAwayListener>
            )}
        </Box>
    )
}

export default TypeField
