
import { InsertPhoto } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import React from 'react'

function TypeField() {
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2}}>
        <IconButton>
            <InsertPhoto sx={{ }} />
        </IconButton>
    </Box>
  )
}

export default TypeField