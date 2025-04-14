import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { 
  SentimentVeryDissatisfied as Angry,
  SentimentDissatisfied as Sad,
  SentimentSatisfied as Neutral,
  SentimentSatisfiedAlt as Happy,
  SentimentVerySatisfied as Excited
} from '@mui/icons-material'

const moods = [
  { emoji: '😠', name: 'angry', icon: <Angry fontSize="large" />,  style:"background-color: rgb(203, 244, 244);"},
  { emoji: '😢', name: 'sad', icon: <Sad fontSize="large" /> },
  { emoji: '😐', name: 'neutral', icon: <Neutral fontSize="large" /> },
  { emoji: '😊', name: 'happy', icon: <Happy fontSize="large" /> },
  { emoji: '😄', name: 'excited', icon: <Excited fontSize="large" /> }
]

export default function MoodSelector({ mood, setMood }) {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Select your current mood
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        {moods.map((m) => (
          <Box
            key={m.name}
            onClick={() => setMood(m.name)}
            sx={{
              cursor: 'pointer',
              p: 2,
              border: mood === m.name ? '2px solid #1976d2' : '1px solid #ddd',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: mood === m.name ? '#f0f7ff' : 'white',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            <span style={{ fontSize: '2rem' }}>{m.emoji}</span>
            <Typography>{m.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}