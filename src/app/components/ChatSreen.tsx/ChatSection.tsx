'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { Box } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Message from './ChatSection/Message'

interface MessageType {
  id: number;
  roomId: number;
  senderId: number;
  text: string;
  timestamp: string;
  fileUrl?: string;
  fileType?: "image" | "video" | "raw";
  fileName: string;
}

function ChatSection() {
  const activeRoomId = useChatUserStore((state) => state.activeRoomId)
  const refreshMessages = useChatUserStore((state) => state.refreshMessages)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [mounted, setMounted] = useState(false)

  console.log("🔵 ChatSection render, activeRoomId =", activeRoomId)

  console.log("🟣 useChatUserStore import in ChatSection =", useChatUserStore)



  useEffect(() => { 
    setMounted(true) 
  }, [])


  useEffect(() => {
    if (!activeRoomId) return

    console.log("Here")

    const fetchMessages = async () => {
      try {
        const res = await axios.get<MessageType[]>(`http://localhost:3001/messages?roomId=${activeRoomId}`)
        setMessages(res.data)
        console.log("Messages state set to:", res.data)
        console.log("API data:", res.data)
      } catch (err) {
        console.error("Error fetching messages:", err)
      }
    }
    fetchMessages()
  }, [activeRoomId, refreshMessages])
  


  if (!mounted) {
    return <Box sx={{ backgroundColor: '#191919', height: '100%' }} />
  }

  return (
    <Box sx={{
      backgroundColor: '#191919',
      height: '100%',
      p: 4,
      overflowY: 'auto',
      pr: 2,
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
          roomId={message.roomId}
          id={message.id}
          senderId={message.senderId}
          text={message.text}
          fileUrl={message.fileUrl}
          fileType={message.fileType}
          fileName={message.fileName}
          timestamp={message.timestamp}
        />
      ))}
    </Box>
  )
}

export default ChatSection
