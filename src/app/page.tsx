'use client'

import Box from '@mui/material/Box';
import Header from "./components/Header";
import ChatRooms from './components/ChatRooms/ChatRooms';
import ChatScreen from './components/ChatSreen.tsx/ChatScreen';
import Info from './components/Info/Info';
import { useChatUserStore } from './store/chatUserStore';
import BlankScreen from './components/BlankScreen';

export default function Home() {
  const chatUserId = useChatUserStore((state) => state.chatUserId)
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Box sx={{ width: '25%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ChatRooms />
        </Box>

        {chatUserId == null ? <BlankScreen /> : (
          <Box sx={{ width: '100%', display: 'flex'}}>
            <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <ChatScreen />
            </Box>

            <Box sx={{ width: '30%' }}>
              <Info />
            </Box>
          </Box>
        )}

      </Box>
    </Box>
  );
}
