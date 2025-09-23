/* eslint-disable @next/next/no-img-element */
'use client'

import { useChatUserStore } from '@/app/store/chatUserStore'
import { Box, Typography, Dialog, IconButton, Button } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
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

interface FileListProps {
  onMoreClickMedia?: () => void
  onMoreClickFiles?: () => void
}

function FileList({ onMoreClickMedia, onMoreClickFiles }: FileListProps) {
  const activeRoomId = useChatUserStore((state) => state.activeRoomId)
  const [media, setMedia] = useState<Message[]>([])
  const [displayMedia, setDisplayMedia] = useState<Message[]>([])
  const [file, setFile] = useState<Message[]>([])
  const [displayFile, setDisplayFile] = useState<Message[]>([])
  const [selectedMedia, setSelectedMedia] = useState<Message | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeRoomId) return
      try {
        const res = await axios.get(
          `http://localhost:3001/messages?roomId=${activeRoomId}`
        )

        const allMsgs: Message[] = res.data

        const sorted = [...allMsgs].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )

        const mediaMsgs = sorted.filter(
          (msg) => msg.text === '[Image]' || msg.text === '[Video]'
        )

        const displayMediaMsgs = mediaMsgs.slice(0, 6)


        const fileMsgs = sorted.filter(
          (msg) => msg.text === '[Document]'
        )

        const displayFileMsgs = fileMsgs.slice(0, 2)

        setMedia(mediaMsgs)
        setDisplayMedia(displayMediaMsgs)
        setFile(fileMsgs)
        setDisplayFile(displayFileMsgs)
      } catch (err) {
        console.error('Error fetching messages:', err)
      }
    }

    fetchMessages()
  }, [activeRoomId, displayMedia])

  // const handleDownload = (url: string, name?: string) => {
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.download = name || 'downloaded-file'
  //   link.click()
  // }

  const getVideoThumbnail = (url: string) => {
    return url
      .replace('/upload/', '/upload/so_0/') // lấy frame đầu tiên
      .replace(/\.(mp4|mov|avi|webm)$/, '.jpg') // đổi đuôi sang jpg
  }

  return (
    <Box sx={{ backgroundColor: '#1A1A1D', height: '100%', p: 2 }}>
      <Typography sx={{ fontFamily: "Ubuntu, sans-serif", fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
        Media
      </Typography>

      {media.length == 0 ? (
        <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontFamily: "Ubuntu, sans-serif", fontSize: '16px', color: 'white' }}>
            No media uploaded yet
          </Typography>
        </Box>

      ) :
        (
          <Box>
            <Box display='grid' sx={{ gridTemplateColumns: 'repeat(3, 1fr)', py: 2, gap: 1 }}>

              {displayMedia.map((msg) => (
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

            {media.length > 6 && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={onMoreClickMedia} fullWidth sx={{ textTransform: "none", backgroundColor: '#F7F7F7', color: '#181C14', fontWeight: 'bold' }}>
                  More
                </Button>
              </Box>

            )}
          </Box>

        )}



      <Typography sx={{ fontFamily: "Ubuntu, sans-serif", fontSize: '18px', fontWeight: 'bold', color: 'white', py: 2 }}>
        File
      </Typography>

      {file.length == 0 ? (
        <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontFamily: "Ubuntu, sans-serif", fontSize: '16px', color: 'white' }}>
            No file uploaded yet
          </Typography>
        </Box>

      ) : (
        <Box>
          {displayFile.map((msg) => (
            <Box key={msg.id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, cursor: 'pointer' }}>
              <Description sx={{ color: "white" }} />
              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "underline" }}>
                {msg.fileName}
              </a>
            </Box>
          ))}

          {file.length > 2 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Button onClick={onMoreClickFiles} fullWidth sx={{ textTransform: "none", backgroundColor: '#F7F7F7', color: '#181C14', fontWeight: 'bold' }}>
                More
              </Button>
            </Box>

          )}
        </Box>
      )
      }



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

              {/* <IconButton
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
              </IconButton> */}
            </>
          )}
        </Box>
      </Dialog>
    </Box>
  )
}

export default FileList
