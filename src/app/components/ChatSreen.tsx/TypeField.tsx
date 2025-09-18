
import { EmojiEmotions, InsertPhoto, Send } from '@mui/icons-material'
import { Box, IconButton, TextField } from '@mui/material'
import React from 'react'

function TypeField() {
    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: '#222222', gap: 1 }}>
            <IconButton>
                <InsertPhoto sx={{ color: '#F5F5F5' }} />
            </IconButton>

            <IconButton>
                <EmojiEmotions sx={{ color: '#F5F5F5' }} />
            </IconButton>

            <TextField
                placeholder="Your message here..."
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                    my: 1,
                    backgroundColor: "#e9eff6",
                    borderRadius: "50px",
                    "& fieldset": { border: "none" },
                    input: { color: "grey.700", fontSize: 14 },
                }}
            />

            <IconButton>
                <Send sx={{ color: '#F5F5F5' }} />
            </IconButton>
        </Box>
    )
}

export default TypeField