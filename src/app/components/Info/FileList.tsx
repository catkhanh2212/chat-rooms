/* eslint-disable @next/next/no-img-element */
'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { Box, Typography, Dialog, IconButton } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'

interface Message {
  id: number
  chatId: number
  senderId: number
  text: string
  timestamp: string
  image: string
}

function FileList() {
  const chatUserId = useChatUserStore((state) => state.chatUserId)
  const [images, setImages] = useState<Message[]>([])
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatUserId) return
      try {
        const res = await axios.get(
          `http://localhost:3001/messages?chatId=${chatUserId}`
        )

        const imageMsgs = res.data.filter(
          (msg: Message) => msg.text === '[Image]' && msg.image
        )
        setImages(imageMsgs)
      } catch (err) {
        console.error('Error fetching messages:', err)
      }
    }

    fetchMessages()
  }, [chatUserId])

  const handleDownload = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = 'downloaded-image.png'
    link.click()
  }

  return (
    <Box sx={{ backgroundColor: '#1A1A1D', height: '100%', p: 2 }}>
      <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
        Media
      </Typography>

      <Box display='grid' sx={{ gridTemplateColumns: 'repeat(3, 1fr)', py: 2, gap: 1 }}>
        {images.map((img) => (
          <Box key={img.id} onClick={() => setSelectedImg(img.image)} sx={{ cursor: 'pointer' }}>
            <img
              src={img.image}
              alt='image'
              style={{ maxWidth: '100px', borderRadius: '3px' }}
            />
          </Box>
        ))}
      </Box>

      <Dialog
        open={!!selectedImg}
        onClose={() => setSelectedImg(null)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {selectedImg && (
            <>
              <img
                src={selectedImg}
                alt="full"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
              <IconButton
                onClick={() => handleDownload(selectedImg)}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                }}
              >
                <DownloadIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Dialog>

    </Box>
  )
}

export default FileList
