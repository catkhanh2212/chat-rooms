/* eslint-disable @next/next/no-img-element */
'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { Box, Typography, Dialog, IconButton } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import { Description } from '@mui/icons-material'

interface Message {
  id: number
  chatId: number
  senderId: number
  text: string
  timestamp: string
  fileUrl?: string;
  fileType?: "image" | "video" | "raw";
  fileName?: string
}

function FileList() {
  const chatUserId = useChatUserStore((state) => state.chatUserId)
  const [media, setMedia] = useState<Message[]>([])
  const [file, setFile] = useState<Message[]>([])
  const [selectedMedia, setSelectedMedia] = useState<Message | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatUserId) return
      try {
        const res = await axios.get(
          `http://localhost:3001/messages?chatId=${chatUserId}`
        )

        const allMsgs: Message[] = res.data

        const sorted = [...allMsgs].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )

        const mediaMsgs = sorted.filter(
          (msg) => msg.text === '[Image]' || msg.text === '[Video]'
        ).slice(0, 6)

        // file: chỉ lấy 5 cái gần nhất
        const fileMsgs = sorted.filter(
          (msg) => msg.text === '[Document]'
        ).slice(0, 5)

        setMedia(mediaMsgs)
        setFile(fileMsgs)
      } catch (err) {
        console.error('Error fetching messages:', err)
      }
    }

    fetchMessages()
  }, [chatUserId])

  const handleDownload = (url: string, name?: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = name || 'downloaded-file'
    link.click()
  }

  const getVideoThumbnail = (url: string) => {
    return url
      .replace('/upload/', '/upload/so_0/') // lấy frame đầu tiên
      .replace(/\.(mp4|mov|avi|webm)$/, '.jpg') // đổi đuôi sang jpg
  }

  return (
    <Box sx={{ backgroundColor: '#1A1A1D', height: '100%', p: 2 }}>
      <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
        Media
      </Typography>

      <Box display='grid' sx={{ gridTemplateColumns: 'repeat(3, 1fr)', py: 2, gap: 1 }}>
        {media.map((msg) => (
          <Box
            key={msg.id}
            onClick={() => setSelectedMedia(msg)}
            sx={{ cursor: 'pointer' }}
          >
            {msg.fileType === "image" ? (
              <img
                src={msg.fileUrl}
                alt='image'
                style={{ width: '100px', height: '100px', borderRadius: '3px', objectFit: 'cover' }}
              />
            ) : msg.fileType === "video" ? (
              <img
                src={getVideoThumbnail(msg.fileUrl!)}
                alt="video thumbnail"
                style={{ width: '100px', height: '100px', borderRadius: '3px', objectFit: 'cover' }}
              />
            ) : null}
          </Box>
        ))}
      </Box>

      <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
        File
      </Typography>

      <Box>
        {file.map((msg) => (
          <Box key={msg.id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, cursor: 'pointer' }}>
            <Description sx={{ color: "white" }} />
            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "underline" }}>
              {msg.fileName}
            </a>
          </Box>
        ))}
      </Box>

      <Dialog
        open={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
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
          {selectedMedia && (
            <>
              {selectedMedia.fileType === "image" ? (
                <img
                  src={selectedMedia.fileUrl!}
                  alt="full"
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    borderRadius: '8px',
                  }}
                />
              ) : selectedMedia.fileType === "video" ? (
                <video
                  src={selectedMedia.fileUrl!}
                  controls
                  autoPlay
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    borderRadius: '8px',
                  }}
                />
              ) : null}

              <IconButton
                onClick={() => handleDownload(selectedMedia.fileUrl!, selectedMedia.fileName)}
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
