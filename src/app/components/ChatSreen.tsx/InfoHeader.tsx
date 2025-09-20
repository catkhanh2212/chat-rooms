'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { Duo } from '@mui/icons-material';
import { Avatar, Box, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface User {
  id: number;
  name: string;
  avatar: string;
}

function InfoHeader() {
  const chatUserId = useChatUserStore((state) => state.chatUserId)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!chatUserId) {
      setUser(null)
      return
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get<User>(`http://localhost:3001/users/${chatUserId}`)
        setUser(res.data)
      } catch (err) {
        console.error("Error fetching user:", err)
        setUser(null)
      }
    }

    fetchUser()
  }, [chatUserId])


  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: '#222222' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Avatar src={user?.avatar} alt='avatar' sx={{ width: '50px', height: '50px' }} />

        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}> {user?.name} </Typography>

      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}>
        <Duo sx={{ width: '40px', height: '40px', color: '#647FBC' }} />
      </Box>
    </Box>
  )
}

export default InfoHeader