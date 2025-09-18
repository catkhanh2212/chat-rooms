import Box from '@mui/material/Box';
import Header from "./components/Header";
import ChatRooms from './components/ChatRooms/ChatRooms';
import ChatScreen from './components/ChatSreen.tsx/ChatScreen';
import Info from './components/Info/Info';

export default function Home() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Box sx={{ width: '25%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ChatRooms />
        </Box>

        <Box sx={{ width: '52.5%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ChatScreen />
        </Box>

        <Box sx={{ width: '22.5%' }}>
          <Info />
        </Box>
      </Box>
    </Box>
  );
}
