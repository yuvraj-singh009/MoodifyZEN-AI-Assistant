import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  MusicNote as MusicIcon,
  MenuBook as StoryIcon,
  Mood as JokeIcon,
  TheaterComedy as ShayariIcon,
  Movie as VideoIcon,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Error as ErrorIcon,
  VolumeDown as SpeakIcon
} from '@mui/icons-material';
import { generateContent } from '../lib/gemini';
import ReactPlayer from 'react-player';

const typeIcons = {
  music: <MusicIcon fontSize="large" />,
  story: <StoryIcon fontSize="large" />,
  joke: <JokeIcon fontSize="large" />,
  shayari: <ShayariIcon fontSize="large" />,
  video: <VideoIcon fontSize="large" />,
  fact: <StoryIcon fontSize="large" />
};

const contentPrompts = {
  music: (mood) => `Provide a popular, available indian YouTube music track for ${mood} mood in this exact JSON format:
{
  "type": "music",
  "title": "Song Title",
  "artist": "Artist Name",
  "youtubeId": "VALID_11_CHAR_ID",
  "description": "Why this matches the mood",
  "thumbnail": "https://img.youtube.com/vi/YOUTUBE_ID/mqdefault.jpg"
}`,

  video: (mood) => `Provide an popular available indian YouTube video for ${mood} mood in this exact JSON format:
{
  "type": "video",
  "title": "Video Title",
  "youtubeId": "VALID_11_CHAR_ID",
  "channel": "Channel Name",
  "description": "Why this matches the mood",
  "thumbnail": "https://img.youtube.com/vi/YOUTUBE_ID/mqdefault.jpg"
}`,

  shayari: (mood) => `Write a 2-3 line Hindi shayari about ${mood} with English translation`,
  joke: (mood) => `Tell a funny,hindi, clean joke about ${mood}`,
  story: (mood) => `Tell a very short (3-5 sentence) story about ${mood} in hindi`,
  text: (mood) => `Talk and response according to my ${mood} in hindi in 2-3 lines`
};

export default function AIResponse({ response, loading }) {
  const [openOptions, setOpenOptions] = useState(false);
  const [mediaContent, setMediaContent] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const speechSynth = useRef(null);

  useEffect(() => {
    speechSynth.current = window.speechSynthesis;
    return () => {
      speechSynth.current.cancel();
    };
  }, []);

  const contentOptions = [
    { type: 'music', label: 'Music/Audio', icon: <MusicIcon /> },
    { type: 'video', label: 'Video', icon: <VideoIcon /> },
    { type: 'shayari', label: 'Shayari', icon: <ShayariIcon /> },
    { type: 'joke', label: 'Jokes', icon: <JokeIcon /> },
    { type: 'story', label: 'Story Telling', icon: <StoryIcon /> },
    { type: 'text', label: 'Text', icon: <StoryIcon /> }
  ];

  const handleOpenOptions = () => setOpenOptions(true);
  const handleCloseOptions = () => setOpenOptions(false);

  const parseMediaResponse = (text) => {
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.slice(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonString);
      
      // Validate YouTube ID format
      if (parsed.youtubeId && parsed.youtubeId.length === 11) {
        return parsed;
      }
      return null;
    } catch (e) {
      console.error("Failed to parse media response", e);
      return null;
    }
  };

  const handleOptionSelect = async (option) => {
    setContentLoading(true);
    handleCloseOptions();
    setPlayerReady(false);

    try {
      const prompt = contentPrompts[option.type](response.mood);
      const generatedContent = await generateContent(prompt);

      if (option.type === 'music' || option.type === 'video') {
        const parsed = parseMediaResponse(generatedContent);
        if (parsed?.youtubeId) {
          // Verify the media is available
          // const isAvailable = await verifyMediaAvailability(parsed.youtubeId);
          // if (!isAvailable) {
          //   throw new Error("The selected media is not available");
          // }
          
          setMediaContent(parsed);
          setSelectedContent({
            type: option.type,
            data: parsed.description,
            isMedia: true
          });
          return;
        }
      }

      setSelectedContent({
        type: option.type,
        data: generatedContent,
        isMedia: false
      });
    } catch (error) {
      console.error("Full Error:", error);
      setSelectedContent({
        type: option.type,
        data: `Error: ${error.message || 'Failed to generate content'}`,
        isError: true
      });
    } finally {
      setContentLoading(false);
    }
  };

  const verifyMediaAvailability = async (youtubeId) => {
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const speakText = (text) => {
    if (isSpeaking) {
      speechSynth.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynth.current.speak(utterance);
    setIsSpeaking(true);
  };

  if (loading || !response) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 3, my: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {typeIcons[response.type] || typeIcons.fact}
          <Typography variant="h6">
            {response.type === 'joke' ? 'Joke for you' :
              response.type === 'music' ? 'Music recommendation' :
              response.type === 'fact' ? 'Interesting fact' :
              'Recommendation for you'}
          </Typography>
        </Box>
        <Typography paragraph>{response.text}</Typography>

        <Button
          variant="contained"
          onClick={handleOpenOptions}
          sx={{ mt: 2 }}
          disabled={contentLoading}
        >
          {contentLoading ? <CircularProgress size={24} /> : 'Choose Content Type'}
        </Button>

        <Dialog open={openOptions} onClose={handleCloseOptions} maxWidth="sm" fullWidth>
          <DialogTitle>Select Content Type</DialogTitle>
          <DialogContent>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
              p: 2
            }}>
              {contentOptions.map((option) => (
                <Button
                  key={option.type}
                  variant="outlined"
                  startIcon={option.icon}
                  onClick={() => handleOptionSelect(option)}
                  sx={{
                    height: '100px',
                    flexDirection: 'column',
                    gap: 1,
                    textTransform: 'none'
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOptions}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {contentLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : selectedContent && (
          <Box sx={{
            mt: 3,
            p: 3,
            border: '1px solid',
            borderColor: selectedContent.isError ? 'error.main' : 'divider',
            borderRadius: 2,
            backgroundColor: selectedContent.isError ? 'error.light' : 'background.paper'
          }}>
            {selectedContent.isMedia ? (
              <>
                <Typography variant="h5" gutterBottom>
                  {mediaContent.title}
                  {mediaContent.artist && ` by ${mediaContent.artist}`}
                  {mediaContent.channel && ` • ${mediaContent.channel}`}
                </Typography>

                {selectedContent.type === 'music' ? (
                  <Box sx={{
                    position: 'relative',
                    height: '100px',
                    mt: 2,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: '#000'
                  }}>
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${mediaContent.youtubeId}`}
                      width="100%"
                      height="100%"
                      playing={playing}
                      muted={muted}
                      onReady={() => setPlayerReady(true)}
                      onError={() => setSelectedContent({
                        ...selectedContent,
                        isError: true,
                        data: "This audio content is not available"
                      })}
                      config={{
                        youtube: {
                          playerVars: {
                            showinfo: 0,
                            controls: 0,
                            modestbranding: 1,
                            disablekb: 1
                          }
                        }
                      }}
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                    {!playerReady && (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.7)'
                      }}>
                        <CircularProgress color="inherit" />
                      </Box>
                    )}
                    <Stack direction="row" spacing={1} sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 1,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      zIndex: 1
                    }}>
                      <IconButton 
                        onClick={() => setPlaying(!playing)} 
                        sx={{ color: '#fff' }}
                        disabled={!playerReady}
                      >
                        {playing ? <Pause /> : <PlayArrow />}
                      </IconButton>
                      <IconButton 
                        onClick={() => setMuted(!muted)} 
                        sx={{ color: '#fff' }}
                      >
                        {muted ? <VolumeOff /> : <VolumeUp />}
                      </IconButton>
                      <Typography variant="body2" sx={{ 
                        color: '#fff', 
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {playerReady ? 'Now Playing' : 'Loading...'}
                      </Typography>
                    </Stack>
                  </Box>
                ) : (
                  <Box sx={{
                    position: 'relative',
                    paddingTop: '56.25%',
                    mt: 2,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: '#000'
                  }}>
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${mediaContent.youtubeId}`}
                      width="100%"
                      height="100%"
                      playing={playing}
                      muted={muted}
                      onReady={() => setPlayerReady(true)}
                      onError={() => setSelectedContent({
                        ...selectedContent,
                        isError: true,
                        data: "This video content is not available"
                      })}
                      controls={false}
                      style={{ position: 'absolute', top: 0, left: 0 }}
                      light={mediaContent.thumbnail}
                      playIcon={
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0,0,0,0.5)'
                        }}>
                          <PlayArrow sx={{ fontSize: 60, color: '#fff' }} />
                        </Box>
                      }
                    />
                    <Stack direction="row" spacing={1} sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 1,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      zIndex: 1
                    }}>
                      <IconButton 
                        onClick={() => setPlaying(!playing)} 
                        sx={{ color: '#fff' }}
                        disabled={!playerReady}
                      >
                        {playing ? <Pause /> : <PlayArrow />}
                      </IconButton>
                      <IconButton 
                        onClick={() => setMuted(!muted)} 
                        sx={{ color: '#fff' }}
                      >
                        {muted ? <VolumeOff /> : <VolumeUp />}
                      </IconButton>
                      <Typography variant="body2" sx={{ 
                        color: '#fff', 
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {playerReady ? 'Now Watching' : 'Loading...'}
                      </Typography>
                    </Stack>
                  </Box>
                )}

                <Typography paragraph sx={{ mt: 2 }}>
                  {selectedContent.data}
                </Typography>
              </>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: selectedContent.isError ? 'error.main' : 'text.primary'
                  }}>
                    {selectedContent.isError ? <ErrorIcon /> :
                      contentOptions.find(o => o.type === selectedContent.type)?.icon}
                    {selectedContent.isError ? 'Error' :
                      contentOptions.find(o => o.type === selectedContent.type)?.label}
                  </Typography>
                  {!selectedContent.isError && (
                    <IconButton 
                      onClick={() => speakText(selectedContent.data)}
                      color={isSpeaking ? 'primary' : 'default'}
                    >
                      <SpeakIcon />
                    </IconButton>
                  )}
                </Box>

                <Typography whiteSpace="pre-wrap" paragraph sx={{ mt: 1 }}>
                  {selectedContent.data}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Paper>
    </motion.div>
  );
}