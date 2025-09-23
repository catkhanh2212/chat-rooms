import { Forum } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import React from 'react'

function BlankScreen() {
  return (
    <Box sx={{ width: '75%', backgroundColor: '#191919', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
      <Forum sx={{ fontSize: '100px', color: '#647FBC' }} />

      <Typography sx={{ fontSize: '28px', color: '#647FBC', fontFamily: "Ubuntu, sans-serif" }}> Welcome back! </Typography>

      <Typography
        sx={{
          fontSize: '16px',
          color: '#647FBC',
          fontFamily: "Ubuntu, sans-serif",
          maxWidth: 500,
          wordBreak: 'break-word',
          pt: 4
        }}
      >
        The current web app demonstrates the flow starting after user login. Due to time constraints, I was not able to implement the full logic flow. Thank you for taking the time to review it.
      </Typography>

    </Box>
  )
}

export default BlankScreen