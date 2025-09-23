'use client'

import { Search } from '@mui/icons-material'
import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ChatCard from './ChatCard'
import { useChatUserStore } from '@/app/store/chatUserStore'

interface User {
  id: string
  name: string
  avatar: string
  verified?: boolean
}

interface Room {
  id: number
  name: string
  members: string[]
  lastMessage: string
  lastMessageTime: string
}

function ChatRooms() {
  const [rooms, setRooms] = useState<(Room & { displayName: string; displayAvatar: string })[]>([])
  const refreshMessages = useChatUserStore((state) => state.refreshMessages)
  const currentUserId = "999" // Me

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, roomsRes] = await Promise.all([
          axios.get<User[]>("http://localhost:3001/users"),
          axios.get<Room[]>("http://localhost:3001/rooms"),
        ])

        const users = usersRes.data

        const merged = roomsRes.data
          .map((room) => {
            // Nếu là 1-1 chat
            if (room.members.length === 2) {
              const otherUserId = room.members.find((id) => id !== currentUserId)
              const otherUser = users.find((u) => u.id === otherUserId)
              return {
                ...room,
                displayName: otherUser?.name ?? room.name,
                displayAvatar: otherUser?.avatar ?? "/default.png",
              }
            }

            // Group chat
            return {
              ...room,
              displayName: room.name,
              displayAvatar: "/group.png",
            }
          })
          .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

        setRooms(merged)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [refreshMessages])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, backgroundColor: '#212121' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontFamily: "Ubuntu, sans-serif", fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
          Chats
        </Typography>
      </Box>

      <TextField
        placeholder="Search contact / chat"
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "grey.600" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          my: 2,
          backgroundColor: "#e9eff6",
          borderRadius: "50px",
          "& fieldset": { border: "none" },
          input: { color: "grey.700", fontSize: 14 },
        }}
      />

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1,
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
        }}
      >
        {rooms.map((room) => (
          <ChatCard
            key={room.id}
            id={room.id}
            name={room.displayName}
            image={room.displayAvatar}
            lastMessage={room.lastMessage}
            time={room.lastMessageTime}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ChatRooms
