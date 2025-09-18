import { Box } from '@mui/material'
import React from 'react'
import InfoHeader from './InfoHeader'
import ChatSection from './ChatSection'
import TypeField from './TypeField'

function ChatScreen() {
  return (
    <Box sx={{ flex: 1, display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>
      <InfoHeader />

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <ChatSection />
      </Box>

      <Box>
      <TypeField />
      </Box>
      
    </Box>
  )
}

export default ChatScreen