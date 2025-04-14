import { useState } from 'react'
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material'

export default function PromptInput({ mood, setResponse }) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!mood) return
    
    setIsLoading(true)
    try {
      setResponse({
        mood,
        text: `I see you're feeling ${mood}. ${prompt ? `You mentioned: "${prompt}".` : ''} What type of content would you like?`,
        type: 'selection',
        userPrompt: prompt
      })
    } catch (error) {
      console.error(error)
      setResponse({
        error: "Failed to get response. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Tell me more about what you'd like
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="I'm feeling [your mood] and I'd like to [hear a joke/watch a funny video/listen to calming music...]"
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        size="large"
        disabled={!mood || isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Get Recommendation'}
      </Button>
    </Box>
  )
}