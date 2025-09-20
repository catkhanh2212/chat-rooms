/* eslint-disable @next/next/no-img-element */
'use client'

import { Avatar, Box, Typography, Dialog, IconButton } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useState } from 'react'
import { formatDate } from "../../../utils/formatDate";
import axios from 'axios';

interface MessageProps {
  id: number;
  chatId: number;
  senderId: number;
  text: string;
  timestamp: string;
  fileUrl?: string;   // Cloudinary secure_url
  fileType?: "image" | "video" | "raw";
}


function Message({ senderId, text, fileUrl, fileType, timestamp }: MessageProps) {
  const selfId = 999
  const [senderAvatar, setSenderAvatar] = useState<string | null>(null)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  useEffect(() => {
    const fetchSenderAvatar = async () => {
      try {
        const res = await axios.get<{ id: number; name: string; avatar: string }>(
          `http://localhost:3001/users/${senderId}`
        )
        setSenderAvatar(res.data.avatar)
      } catch (err) {
        console.error("Error fetching user:", err)
      }
    }

    fetchSenderAvatar()
  }, [senderId])

  const handleDownload = (url: string) => {
    const a = document.createElement("a")
    a.href = url
    a.download = "image.jpg"
    a.click()
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography sx={{ textAlign: 'center', color: '#F5F7F8' }}>
        {formatDate(timestamp)}
      </Typography>


      {senderId !== selfId && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
          <Avatar src={senderAvatar ?? "/default.png"} alt="avatar" />
          <Box sx={{ p: 2, backgroundColor: '#212121', borderRadius: 2 }}>
            <Typography sx={{ color: 'white', ml: 1 }}>{text}</Typography>
            {/* image */}
            {fileType === "image" && fileUrl && (
              <img
                src={fileUrl}
                alt="uploaded"
                style={{ maxWidth: "200px", borderRadius: "8px", cursor: "pointer" }}
                onClick={() => setSelectedImg(fileUrl)}
              />
            )}

            {/* video */}
            {fileType === "video" && fileUrl && (
              <video
                src={fileUrl}
                controls
                style={{ maxWidth: "250px", borderRadius: "8px", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImg(fileUrl) // reuse dialog để mở rộng video
                }}
              />
            )}

            {/* raw file */}
            {fileType === "raw" && fileUrl && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                <DownloadIcon sx={{ color: "white" }} />
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "underline" }}>
                  {text || "Download file"}
                </a>
              </Box>
            )}
          </Box>
        </Box>
      )}


      {senderId === selfId && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, my: 2 }}>
          <Box sx={{ p: 2, backgroundColor: '#799EFF', borderRadius: 2 }}>
            {text !== '[Image]' && text != '[Video]' && (
              <Typography sx={{ color: 'white', ml: 1 }}>{text}</Typography>
            )}
            {/* image */}
            {fileType === "image" && fileUrl && (
              <img
                src={fileUrl}
                alt="uploaded"
                style={{ maxWidth: "200px", borderRadius: "8px", cursor: "pointer" }}
                onClick={() => setSelectedImg(fileUrl)}
              />
            )}

            {/* video */}
            {fileType === "video" && fileUrl && (
              <video
                src={fileUrl}
                controls
                style={{ maxWidth: "250px", borderRadius: "8px", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImg(fileUrl) // reuse dialog để mở rộng video
                }}
              />
            )}

            {/* raw file */}
            {fileType === "raw" && fileUrl && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                <DownloadIcon sx={{ color: "white" }} />
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "underline" }}>
                  {text || "Download file"}
                </a>
              </Box>
            )}
          </Box>
          <Avatar src={senderAvatar ?? "/default.png"} alt="avatar" />
        </Box>
      )}

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
        {selectedImg && (
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {selectedImg.endsWith(".mp4") || selectedImg.includes("/video/") ? (
              <video
                src={selectedImg}
                controls
                style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px' }}
              />
            ) : (
              <img
                src={selectedImg}
                alt="full"
                style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px' }}
              />
            )}

            {fileType !== 'video' && (
              <IconButton
                onClick={() => handleDownload(selectedImg)}
                sx={{ position: 'absolute', bottom: 16, right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
              >
                <DownloadIcon />
              </IconButton>
            )}


            <IconButton
              onClick={() => setSelectedImg(null)}
              sx={{ position: 'absolute', top: 16, right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Dialog>

    </Box>
  )
}

export default Message
