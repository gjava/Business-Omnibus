import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only when needed to avoid instant crashes if key is missing
const getClient = () => {
  if (!apiKey) {
    console.warn("API_KEY is missing. Gemini features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getDestinationInsights = async (city: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI insights unavailable (Missing API Key).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a very short, catchy 2-sentence marketing blurb about why someone should travel to ${city} by bus right now. Keep it under 40 words.`,
    });
    return response.text || `Discover the beauty of ${city}!`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Enjoy a comfortable ride to ${city}.`;
  }
};
