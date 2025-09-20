
import { Avatar, Box } from '@mui/material'
import Image from 'next/image'
import React from 'react'

function Header() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1A1A1D', p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image src='/logo.png' width={50} height={50} alt='logo' />
      </Box>

      <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
        <Avatar alt='avatar' src='/avatar.png' />
      </Box>
    </Box>
  )
}

export default Header