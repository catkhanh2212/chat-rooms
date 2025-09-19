import { Forum } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import React from 'react'

function BlankScreen() {
  return (
    <Box sx={{ width: '75%', backgroundColor: '#191919', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
        <Forum sx={{ fontSize: '100px', color: '#647FBC'}} />

        <Typography sx={{ fontSize: '28px', color: '#647FBC' }}> Welcome back! </Typography>
    </Box>
  )
}

export default BlankScreen