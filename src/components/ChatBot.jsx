// import { useState, useRef, useEffect } from 'react';
// import {
//   Box,
//   IconButton,
//   TextField,
//   Paper,
//   Typography,
//   Avatar,
//   CircularProgress,
//   Tooltip,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import {
//   Send as SendIcon,
//   Close as CloseIcon,
//   SmartToy as BotIcon,
//   Person as UserIcon
// } from '@mui/icons-material';
// import { generateChatResponse } from '../lib/gemini'; // Make sure this path is correct

// const ChatBot = () => {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       text: "Hello! I'm your Mood Assistant. How can I help you today?",
//       sender: 'bot'
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const messagesEndRef = useRef(null);

//   const toggleChat = () => setOpen(!open);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage = { text: input, sender: 'user' };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);
//     setError(null);

//     try {
//       const botResponse = await generateChatResponse(input, messages);
//       setMessages(prev => [...prev, {
//         text: botResponse,
//         sender: 'bot'
//       }]);
//     } catch (error) {
//       console.error("Chat Error:", error);
//       setError(error.message || "Failed to get response. Please try again.");
//       setMessages(prev => [...prev, {
//         text: "Sorry, I couldn't process your request. Please try again.",
//         sender: 'bot'
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleCloseError = () => {
//     setError(null);
//   };

//   return (
//     <Box sx={{
//       position: 'fixed',
//       bottom: 24,
//       right: 24,
//       zIndex: 1000,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'flex-end'
//     }}>
//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={handleCloseError}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
//           {error}
//         </Alert>
//       </Snackbar>

//       {open ? (
//         <Paper elevation={10} sx={{
//           width: 350,
//           maxWidth: '90vw',
//           height: 500,
//           display: 'flex',
//           flexDirection: 'column',
//           borderRadius: 2,
//           overflow: 'hidden',
//           bgcolor: 'background.paper'
//         }}>
//           <Box sx={{
//             bgcolor: 'primary.main',
//             color: 'primary.contrastText',
//             p: 2,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}>
//             <Typography variant="h6">Mood Assistant</Typography>
//             <IconButton onClick={toggleChat} size="small" sx={{ color: 'inherit' }}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <Box sx={{
//             flex: 1,
//             p: 2,
//             overflowY: 'auto',
//             bgcolor: 'background.default'
//           }}>
//             {messages.map((msg, index) => (
//               <Box key={index} sx={{
//                 display: 'flex',
//                 mb: 2,
//                 justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
//               }}>
//                 <Box sx={{
//                   display: 'flex',
//                   maxWidth: '80%',
//                   alignItems: 'flex-start',
//                   gap: 1
//                 }}>
//                   {msg.sender === 'bot' && (
//                     <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
//                       <BotIcon fontSize="small" />
//                     </Avatar>
//                   )}
//                   <Paper elevation={1} sx={{
//                     p: 1.5,
//                     borderRadius: 2,
//                     bgcolor: msg.sender === 'user' ? 'primary.light' : 'background.paper',
//                     color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary'
//                   }}>
//                     <Typography variant="body1" whiteSpace="pre-wrap">
//                       {msg.text}
//                     </Typography>
//                   </Paper>
//                   {msg.sender === 'user' && (
//                     <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
//                       <UserIcon fontSize="small" />
//                     </Avatar>
//                   )}
//                 </Box>
//               </Box>
//             ))}
//             {loading && (
//               <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
//                 <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
//                   <BotIcon fontSize="small" />
//                 </Avatar>
//                 <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2, ml: 1 }}>
//                   <CircularProgress size={20} />
//                 </Paper>
//               </Box>
//             )}
//             <div ref={messagesEndRef} />
//           </Box>

//           <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Type your message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={handleKeyPress}
//               disabled={loading}
//               InputProps={{
//                 endAdornment: (
//                   <IconButton
//                     onClick={handleSendMessage}
//                     disabled={!input.trim() || loading}
//                     color="primary"
//                   >
//                     <SendIcon />
//                   </IconButton>
//                 )
//               }}
//             />
//           </Box>
//         </Paper>
//       ) : (
//         <Tooltip title="Chat with Mood Assistant">
//           <IconButton
//             onClick={toggleChat}
//             color="primary"
//             sx={{
//               bgcolor: 'primary.main',
//               color: 'primary.contrastText',
//               width: 56,
//               height: 56,
//               '&:hover': {
//                 bgcolor: 'primary.dark'
//               }
//             }}
//           >
//             <BotIcon fontSize="large" />
//           </IconButton>
//         </Tooltip>
//       )}
//     </Box>
//   );
// };

// export default ChatBot;


import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  TextField, 
  Paper, 
  Typography, 
  Avatar, 
  CircularProgress,
  Tooltip
} from '@mui/material';
import { 
  Send as SendIcon, 
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as UserIcon
} from '@mui/icons-material';
import { generateChatResponse } from '../lib/gemini'; // ✅ Corrected import

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your Mood Assistant. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setOpen(!open);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const prompt = `You are a helpful mood assistant. Respond to the user's message: "${input}"`;
      const botResponse = await generateChatResponse(prompt, [...messages, userMessage]); // ✅ Passing full history
      
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't process your request. Please try again.", 
        sender: 'bot' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
    }}>
      {open && (
        <Paper elevation={10} sx={{
          width: 350,
          maxWidth: '90vw',
          height: 500,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Box sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6">Mood Assistant</Typography>
            <IconButton onClick={toggleChat} size="small" sx={{ color: 'inherit' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{
            flex: 1,
            p: 2,
            overflowY: 'auto',
            bgcolor: 'background.default'
          }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{
                display: 'flex',
                mb: 2,
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <Box sx={{
                  display: 'flex',
                  maxWidth: '80%',
                  alignItems: 'flex-start',
                  gap: 1
                }}>
                  {msg.sender === 'bot' && (
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <BotIcon fontSize="small" />
                    </Avatar>
                  )}
                  <Paper elevation={1} sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.sender === 'user' ? 'primary.light' : 'background.paper',
                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary'
                  }}>
                    <Typography variant="body1" whiteSpace="pre-wrap">
                      {msg.text}
                    </Typography>
                  </Paper>
                  {msg.sender === 'user' && (
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                      <UserIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <BotIcon fontSize="small" />
                </Avatar>
                <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2, ml: 1 }}>
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    onClick={handleSendMessage}
                    disabled={!input.trim() || loading}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                )
              }}
            />
          </Box>
        </Paper>
      )}

      {!open && (
        <Tooltip title="Chat with Mood Assistant">
          <IconButton
            onClick={toggleChat}
            color="primary"
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              width: 56,
              height: 56,
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            <BotIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ChatBot;