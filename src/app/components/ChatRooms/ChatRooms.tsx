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
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([]) 
  const refreshMessages = useChatUserStore((state) => state.refreshMessages)
  const currentUserId = "999" // Me

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, roomsRes] = await Promise.all([
          axios.get<User[]>("http://localhost:3001/users"),
          axios.get<Room[]>("http://localhost:3001/rooms"),
        ])

        const usersData = usersRes.data
        setUsers(usersData)

        const merged = roomsRes.data
          .map((room) => {
            if (room.members.length === 2) {
              const otherUserId = room.members.find((id) => id !== currentUserId)
              const otherUser = usersData.find((u) => u.id === otherUserId)
              return {
                ...room,
                displayName: otherUser?.name ?? room.name,
                displayAvatar: otherUser?.avatar ?? "/default.png",
              }
            }

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

  const filteredRooms = rooms.filter(room => {
    const keyword = searchTerm.toLowerCase()
    if (!keyword) return true

    if (room.displayName.toLowerCase().includes(keyword)) return true
  
    const matched = room.members.some(memberId => {
      const user = users.find(u => u.id === memberId)
      return user?.name.toLowerCase().includes(keyword)
    })
  
    return matched
  })
  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, backgroundColor: '#212121' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontFamily: "Ubuntu, sans-serif", fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
          Chats
        </Typography>
      </Box>

      <TextField
        placeholder="Search"
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
    scrollbarGutter: 'stable',
          pr: 1,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#555', borderRadius: '4px' },
          '&::-webkit-scrollbar-thumb:hover': { background: '#777' },
        }}
      >
        {filteredRooms.map((room) => (
          <ChatCard
            key={room.id}
            id={room.id}
            name={room.displayName}
            image={room.displayAvatar}
            lastMessage={room.lastMessage}
            time={room.lastMessageTime}
          />
        ))}

        {filteredRooms.length === 0 && (
          <Typography sx={{ color: 'grey.400', textAlign: 'center', mt: 2 }}>
            No results found
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default ChatRooms
