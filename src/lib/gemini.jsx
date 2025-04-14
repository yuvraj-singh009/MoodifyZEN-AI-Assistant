import { GoogleGenerativeAI } from "@google/generative-ai";

// Verify API key before creating instance
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error("Missing VITE_GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Common model configuration
const getModelConfig = () => ({
  model: "gemini-1.5-pro", // Using stable version
  generationConfig: {
    maxOutputTokens: 2000,
    temperature: 0.9,
    topP: 0.95,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_ONLY_HIGH"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_ONLY_HIGH"
    }
  ]
});

export async function generateContent(prompt) {
  try {
    const model = genAI.getGenerativeModel(getModelConfig());
    
    // Add prompt validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error("Invalid prompt provided");
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from API");
    }
    
    return text;
  } catch (error) {
    console.error("Content Generation Error:", {
      message: error.message,
      stack: error.stack,
      prompt: prompt
    });
    
    throw new Error(`Failed to generate content: ${getUserFriendlyError(error)}`);
  }
}

export async function generateChatResponse(prompt, history = []) {
  try {
    const model = genAI.getGenerativeModel(getModelConfig());
    
    // Validate inputs
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Invalid prompt provided");
    }
    
    if (!Array.isArray(history)) {
      throw new Error("History must be an array");
    }

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8 // Slightly more focused for chat
      }
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from API");
    }
    
    return text;
  } catch (error) {
    console.error("Chat Error:", {
      message: error.message,
      stack: error.stack,
      prompt: prompt,
      history: history
    });
    
    throw new Error(`Failed to generate response: ${getUserFriendlyError(error)}`);
  }
}

// Helper function for user-friendly errors
function getUserFriendlyError(error) {
  const message = error.message.toLowerCase();
  
  if (message.includes("api key")) {
    return "Invalid API key. Please check your configuration.";
  }
  if (message.includes("quota") || message.includes("limit")) {
    return "API quota exceeded. Please check your usage limits.";
  }
  if (message.includes("model")) {
    return "Model unavailable. Please try again later.";
  }
  if (message.includes("content")) {
    return "Content policy violation. Please modify your request.";
  }
  if (message.includes("network")) {
    return "Network error. Please check your connection.";
  }
  
  return "Please try again later.";
}