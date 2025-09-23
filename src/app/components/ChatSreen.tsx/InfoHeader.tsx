'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { Duo } from '@mui/icons-material';
import { Avatar, AvatarGroup, Box, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Room {
  id: number;
  name: string;
  members: string[]; // array of userId
  lastMessage: string;
  lastMessageTime: string;
}

const selfId = "999"; // 👈 id của "Me"

function InfoHeader() {
  const activeRoomId = useChatUserStore((state) => state.activeRoomId)
  const [room, setRoom] = useState<Room | null>(null)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (!activeRoomId) {
      setRoom(null)
      return
    }

    const fetchData = async () => {
      try {
        const [roomRes, usersRes] = await Promise.all([
          axios.get<Room>(`http://localhost:3001/rooms/${activeRoomId}`),
          axios.get<User[]>(`http://localhost:3001/users`)
        ])
        setRoom(roomRes.data)
        setUsers(usersRes.data)
      } catch (err) {
        console.error("Error fetching room/users:", err)
        setRoom(null)
      }
    }

    fetchData()
  }, [activeRoomId])

  if (!room) return null

  // Map members -> user objects
  const memberUsers = room.members
    .map(id => users.find(u => u.id === id))
    .filter((u): u is User => !!u)

  // Bỏ self
  const otherMembers = memberUsers.filter(u => u.id !== selfId)

  const maxAvatars = 3
  const visibleAvatars = otherMembers.slice(0, maxAvatars)
  const remaining = otherMembers.length - maxAvatars

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: '#222222' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        {/* Avatar hiển thị */}
        {visibleAvatars.length === 1 && (
          <Avatar src={otherMembers[0].avatar} alt={otherMembers[0].name} sx={{ width: 50, height: 50 }} />
        )}

        {visibleAvatars.length > 1 && (
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 45, height: 45, fontSize: 14 } }}>
            {visibleAvatars.map(member => (
              <Avatar key={member.id} src={member.avatar} alt={member.name} />
            ))}

            {remaining > 0 && (
              <Avatar sx={{ width: 40, height: 40, fontSize: 14, bgcolor: '#799EFF', color: 'black', fontWeight: 'bold' }}>
                +{remaining}
              </Avatar>
            )}
          </AvatarGroup>
        )}



        {/* Hiển thị tên */}
        <Typography sx={{ fontFamily: "Ubuntu, sans-serif", fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
          {otherMembers.length === 1
            ? otherMembers[0].name
            : room.name // 👈 group chat thì show tên phòng
          }
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}>
        <Duo sx={{ width: '40px', height: '40px', color: '#647FBC' }} />
      </Box>
    </Box>
  )
}

export default InfoHeader
