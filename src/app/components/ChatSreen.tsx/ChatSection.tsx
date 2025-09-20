'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { Box } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Message from './ChatSection/Message'

interface Message {
  id: number;
  chatId: number;
  senderId: number;
  text: string;
  timestamp: string;
  fileUrl?: string; 
  fileType?: "image" | "video" | "raw"; 
}


function ChatSection() {
  const chatUserId = useChatUserStore((state) => state.chatUserId)
  const refreshMessages = useChatUserStore((state) => state.refreshMessages)
  const [messages, setMessages] = useState<Message[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!chatUserId) return
    const fetchMessages = async () => {
      try {
        const res = await axios.get<Message[]>(`http://localhost:3001/messages?chatId=${chatUserId}`)
        setMessages(res.data)
      } catch (err) {
        console.error("Error fetching messages:", err)
      }
    }
    fetchMessages()
  }, [chatUserId, refreshMessages])

  if (!mounted) {
    return <Box sx={{ backgroundColor: '#191919', height: '100%' }} />
  }

  return (
    <Box sx={{
      backgroundColor: '#191919', height: '100%', p: 4, overflowY: 'auto', pr: 2,
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
      {messages.map((message) => (
        <Message
          key={message.id}
          chatId={message.chatId}
          id={message.id}
          senderId={message.senderId}
          text={message.text}
          fileUrl={message.fileUrl}
          fileType={message.fileType}
          timestamp={message.timestamp} />
      ))}
    </Box>
  )
}

export default ChatSection